package kr.wisemobile.parking.mynavigation.apps;

import com.facebook.react.bridge.ReactApplicationContext;

public interface AppNavigation {
    void onNavigating(ReactApplicationContext context, String name, Double latDest, Double lngDest);

    void onNavigating(ReactApplicationContext context, String name, Double latDest, Double lngDest, Double latCurrent, Double lngCurrent);
}
