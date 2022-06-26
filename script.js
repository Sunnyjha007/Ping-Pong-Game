let userPaddle = document.querySelector('#user-paddle');
let compPaddle = document.querySelector('#comp-paddle');
let ball = document.querySelector('#ball');
userPaddle.style.marginLeft ='30px';
userPaddle.style.marginTop = '0px';
compPaddle.style.marginLeft = '1048px';
compPaddle.style.marginTop = '0px';
ball.style.marginLeft = '534px';
ball.style.marginTop = '262px';

let ID;
let w_pressed = false;
let s_pressed = false;

let vx=-1;
let vy=-1;
let v = Math.sqrt(Math.sqrt(Math.pow(vx,2)+Math.pow(vy,2)));

document.addEventListener('keydown',(e)=>{
	if(e.keyCode=='87'){
		w_pressed = true;
	}else if(e.keyCode=='83'){
		s_pressed = true;
	}
})

document.addEventListener('keyup',(e)=>{
	if(e.keyCode=='87'){
		w_pressed = false;
	}else if(e.keyCode=='83'){
		s_pressed = false;
	}
})


function reset(){
	new Audio('score.wav').play();
	clearInterval(ID);
	vx=-1;
	vy=-1;
	v = Math.sqrt(Math.sqrt(Math.pow(vx,2)+Math.pow(vy,2)));
	ball.style.marginLeft = '534px';
	ball.style.marginTop = '262px';
	setTimeout(gameLoop, 500);
	// gameLoop();
}
gameLoop();
function gameLoop(){
	setTimeout(()=>{
		ID = setInterval(() => {

			if(document.querySelector('#comp-score').innerHTML==10){
				new Audio('lose.mp3').play();
				window.alert('YOU LOOSE!!!!!');
				document.querySelector('#comp-score').innerHTML = 0;
				document.querySelector('#user-score').innerHTML = 0;
				reset();
				return;
			}
			if(document.querySelector('#user-score').innerHTML==10){
				new Audio('win1.wav').play();
				window.alert('YOU WIN!!!!');
				document.querySelector('#comp-score').innerHTML = 0;
				document.querySelector('#user-score').innerHTML = 0;
				reset();
				return;
			}
			if(marginLeft(ball)<0){
				document.querySelector('#comp-score').innerHTML = Number(document.querySelector('#comp-score').innerHTML)+1;
				reset();
				return ;
			}
			if((marginLeft(ball)+20)>1088){
				document.querySelector('#user-score').innerHTML = Number(document.querySelector('#user-score').innerHTML)+1;
				reset();
				return ;
			}
			if(marginTop(ball)<0||(marginTop(ball)+20)>544){
				new Audio('wall hit.mp3').play();
				vy=-vy;
			}
			let paddle = ((marginLeft(ball)+10)<544)? userPaddle:compPaddle;
			if(collisionDetected(paddle)){
				new Audio('paddle hit.wav').play();
				let angle;
				let type = (marginLeft(paddle)==30)? 'user' : 'comp';
				if(ball.centerY<paddle.centerY){
					angle = (type=='user'? -Math.PI/4:(-3*Math.PI)/4);
				}else if(ball.centerY>paddle.centerY){
					angle = (type=='user'? Math.PI/4:(3*Math.PI)/4);
				}else if(ball.centerY==paddle.centerY){
					angle = (type=='user'?0:Math.PI);
				}
				v+=0.5;
				vx = v*Math.cos(angle);
				vy = v*Math.sin(angle);
			}
			let complevel=0.1;//increase compititiion level
			compPaddle.style.marginTop = `${marginTop(compPaddle)+((ball.centerY-(marginTop(compPaddle)+36)))*complevel}px`;
			ball.style.marginLeft = `${marginLeft(ball)+vx}px`;
			ball.style.marginTop = `${marginTop(ball)+vy}px`;
			if(w_pressed&&marginTop(userPaddle)>0){
				userPaddle.style.marginTop = `${marginTop(userPaddle)-2}px`;
			}else if(s_pressed&&marginTop(userPaddle)<472){
				userPaddle.style.marginTop = `${marginTop(userPaddle)+2}px`;
			}

			if(marginTop(compPaddle)<0){
				compPaddle.style.marginTop = '0px';
			}else if(marginTop(compPaddle)>472){
				compPaddle.style.marginTop = '472px';
			}

		}, 5)
	},500)
}

function collisionDetected(paddle){
	ball.top = marginTop(ball);
	ball.bottom = marginTop(ball)+20;
	ball.left = marginLeft(ball);
	ball.right = marginLeft(ball)+20;
	ball.centerX = marginLeft(ball)+10; 
	ball.centerY = marginTop(ball)+10;

	paddle.top = marginTop(paddle);
	paddle.bottom = marginTop(paddle)+72;
	paddle.left = marginLeft(paddle);
	paddle.right = marginLeft(paddle)+10;
	paddle.centerX = marginLeft(paddle)+5; 
	paddle.centerY = marginTop(paddle)+36;

        let type = (marginLeft(paddle)==30)? 'user' : 'comp';
	let boolean  = false;
	if(type=='user'&&vx<0)boolean=true;
	else if(type=='comp'&&vx>0)boolean=true;

	return (ball.left<paddle.right&&ball.top<paddle.bottom&&ball.right>paddle.left&&ball.bottom>paddle.top&&boolean);

}

function marginTop(elem){
	return Number(elem.style.marginTop.split('p')[0]);
}

function marginLeft(elem){
	return Number(elem.style.marginLeft.split('p')[0]);
}