package net.goodweight;


public class JSInterface {
	private GoodWeightActivity goodWeightActivity;
	public JSInterface (GoodWeightActivity goodWeightActivity) {
		this.goodWeightActivity = goodWeightActivity;
	}
	
	public void pauseGoodWeightApp(){
		
	}

	public void playAudio(){
		this.goodWeightActivity.playAudio();
	}
	
	public void pauseAudio(){
		this.goodWeightActivity.pauseAudio();
	}
}
