package kr.wisemobile.parking.mynavigation;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import kr.wisemobile.parking.mynavigation.apps.AtlanNavigation;
import kr.wisemobile.parking.mynavigation.apps.KakaonaviNavigation;
import kr.wisemobile.parking.mynavigation.apps.LgPlusNavigation;
import kr.wisemobile.parking.mynavigation.apps.SktNavigation;
import kr.wisemobile.parking.mynavigation.commons.Utils;

public class MyNavigationModule extends ReactContextBaseJavaModule {
    private static String MODULE_NAME = "MyNavigationModule";
    public static ReactApplicationContext mReactContext= null;
    private SktNavigation sktNavigation;
    private AtlanNavigation atlanNavigation;
    private LgPlusNavigation lgPlusNavigation;

    private KakaonaviNavigation kakaonaviNavigation;
    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    public MyNavigationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
        sktNavigation = new SktNavigation();
        atlanNavigation = new AtlanNavigation();
        lgPlusNavigation = new LgPlusNavigation();
        kakaonaviNavigation = new KakaonaviNavigation();
    }

    @ReactMethod
    void navigationWithKT(String name,double lat, double lng) {
        if (sktNavigation != null) {
            sktNavigation.onNavigating(mReactContext, name, lat, lng);
        }
    }

    @ReactMethod
    void navigationWithAtlan(String name,double lat, double lng) {
        if (atlanNavigation != null) {
            atlanNavigation.onNavigating(mReactContext, name, lat, lng);
        }
    }

    @ReactMethod
    void navigationWithLgPlus(String name,double lat, double lng) {
        if (lgPlusNavigation != null) {
            lgPlusNavigation.onNavigating(mReactContext, name, lat, lng);
        }
    }


    @ReactMethod
    void navigationWithKakaoNavi(String name,double lat, double lng) {
        if (kakaonaviNavigation != null) {
            kakaonaviNavigation.onNavigating(mReactContext, name, lat, lng);
        }
    }

    @ReactMethod
    void isAppInstall(String packageName, Promise promise) {
        try {
            promise.resolve(Utils.isInstalledApplication(mReactContext, packageName));
        }catch (Exception exception) {
            promise.reject("error");
        }
    }
}
