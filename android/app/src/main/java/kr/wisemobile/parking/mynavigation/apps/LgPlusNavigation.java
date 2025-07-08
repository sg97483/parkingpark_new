package kr.wisemobile.parking.mynavigation.apps;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;

import kr.wisemobile.parking.mynavigation.commons.Utils;

public class LgPlusNavigation implements AppNavigation {
    private static final String ACTION_NAVI_EXTERNAL_SERVICE = "one.navi.action.NAVI_EXTERNAL_SERVICE";
    private static final String ACTION_NAVI_EXTERNAL_EXTRA_KIND = "one.navi.extra.NAVI_EXTRA_KIND";
    private static final String ACTION_NAVI_EXTERNAL_EXTRA_VALUE = "one.navi.extra.NAVI_EXTRA_VALUE";
    private static final String ACTION_NAVI_EXTERNAL_EXTRA_ADD_VALUE_2 = "one.navi.extra.NAVI_EXTRA_ADD_VALUE_2";

    @Override
    public void onNavigating(ReactApplicationContext context, String name, Double latDest, Double lngDest) {
        onNavigating(context, name, latDest, lngDest, null, null);
    }

    @Override
    public void onNavigating(ReactApplicationContext context, String name, Double latDest, Double lngDest,
            Double latCurrent, Double lngCurrent) {
        boolean installed = Utils.isInstalledApplication(context, "com.lguplus.navi");
        if (installed) {
            Intent intent = new Intent();
            intent.setPackage("com.lguplus.navi");
            intent.addFlags(Intent.FLAG_INCLUDE_STOPPED_PACKAGES);
            intent.setAction(ACTION_NAVI_EXTERNAL_SERVICE);
            intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_KIND, "lonlat");
            double[] location = { 0, 0, latDest, lngDest };
            intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_VALUE, location);
            intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_ADD_VALUE_2, name);
            context.getBaseContext().sendBroadcast(intent);
            Log.d("LG Plus ne", String.valueOf(intent));

            //
            // Intent intent =
            // context.getPackageManager().getLaunchIntentForPackage("com.lguplus.navi");
            // intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            // intent.setAction(ACTION_NAVI_EXTERNAL_SERVICE);
            // intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_KIND, "lonlat");
            // double[] location = {37.5425573, 127.0453936, latDest, lngDest};
            // intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_VALUE, location);
            // Toast.makeText(context, "start:" + location.toString(),
            // Toast.LENGTH_SHORT).show();
            // intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_ADD_VALUE_2, name);
            // context.startActivity(intent);
        } else {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.addCategory(Intent.CATEGORY_DEFAULT);
                intent.setData(Uri.parse("market://details?id=com.lguplus.navi"));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            } catch (Exception e) {
                Toast.makeText(context, "안드로이드 마켓(구글 플레이)에서 \"원내비(U+)\"를 다운로드 받아주세요.", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
