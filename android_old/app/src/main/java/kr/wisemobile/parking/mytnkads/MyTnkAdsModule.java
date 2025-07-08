package kr.wisemobile.parking.mytnkads;

import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.tnkfactory.ad.AdItem;
import com.tnkfactory.ad.AdListener;
import com.tnkfactory.ad.InterstitialAdItem;
import com.tnkfactory.ad.AdError;
import kr.wisemobile.parking.BuildConfig;

import kr.wisemobile.parking.mynavigation.apps.AtlanNavigation;
import kr.wisemobile.parking.mynavigation.apps.KakaonaviNavigation;
import kr.wisemobile.parking.mynavigation.apps.LgPlusNavigation;
import kr.wisemobile.parking.mynavigation.apps.SktNavigation;

public class MyTnkAdsModule extends ReactContextBaseJavaModule {
    private static String NAME = "MyTnkAdsModule";
    public static ReactApplicationContext mReactContext = null;

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    public MyTnkAdsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
    }

    @ReactMethod
    public void exitDialogTnkAdOpen(Promise promise) {
        InterstitialAdItem adItem = new InterstitialAdItem(mReactContext.getCurrentActivity(),
                BuildConfig.DEBUG ? "INTERSTITIAL_V" : "파킹박",
                new AdListener() {
                    @Override
                    public void onLoad(AdItem adItem) {
                        adItem.show();
                    }

                    @Override
                    public void onClose(AdItem adItem, int i) {
                        super.onClose(adItem, i);
                        promise.resolve(i);
                    }

                    @Override
                    public void onError(AdItem adItem, AdError adError) {
                        super.onError(adItem, adError);
                        promise.resolve(adError.getValue());
                    }
                });

        adItem.load();
    }
}
