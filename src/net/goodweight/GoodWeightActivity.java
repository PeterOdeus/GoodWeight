package net.goodweight;

import java.io.IOException;

import android.media.MediaPlayer;
import android.media.MediaPlayer.OnPreparedListener;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;

import com.phonegap.DroidGap;

public class GoodWeightActivity extends DroidGap implements OnPreparedListener{
	
	private MediaPlayer mediaPlayer;
	private boolean mediaPlayerPrepared;
	private JSInterface myJSInterface;
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        //Fullscreen
        setFullscreen();
        
        super.init();
        this.appView.getSettings().setJavaScriptEnabled(true);
        myJSInterface = new JSInterface(this);
        this.appView.addJavascriptInterface(myJSInterface, "JSInterface");
        
        String language = java.util.Locale.getDefault().getLanguage();
        if(language == null || language != null && language.trim().equalsIgnoreCase("")){
        	language = "en";
        }  
        super.loadUrl("file:///android_asset/www/index.html");
        //super.loadUrl("file:///android_asset/www/index.html?lang=" + language);
        //super.loadUrl("file:///android_asset/www/mobiscroll/demo.html");
        
        //Audio removed in favor of PhoneGap Media API. Or not.
       prepareAudio();
    }
    
    
    
    private void prepareAudio(){
    	//mediaPlayer = MediaPlayer.create(this, R.raw.birdies);
//    	mediaPlayer.setLooping(true);
//    	mediaPlayer.setOnPreparedListener(this);    	
    }
    
  //Fullscreen (No title bar and status bar) 
    public void setFullscreen() {  
         getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);  //Clean FLAG  
         requestWindowFeature(Window.FEATURE_NO_TITLE);  
         getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,  
                        WindowManager.LayoutParams.FLAG_FULLSCREEN);  
    }
	
    @Override
    protected void onPause() {
    	super.onPause();
    	//pauseAudio();
    }
	@Override
    protected void onResume(){
    	super.onResume();
    	//playAudio();
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
        // TODO Auto-generated method stub
        if (mediaPlayer != null) {
        	mediaPlayer.stop();
            mediaPlayer.release();
            mediaPlayer = null;
        }

    }
    
    public void playAudio(){
    	if(mediaPlayerPrepared == true && mediaPlayer != null){
    		mediaPlayer.start();
    	}
    }
    
    public void pauseAudio() {
    	if (mediaPlayerPrepared == true && mediaPlayer != null) {
            mediaPlayer.pause();
        }
	}
    
	@Override
	public void onPrepared(MediaPlayer mp) {
		this.mediaPlayerPrepared = true;
	}
	
}
