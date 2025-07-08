package kr.wisemobile.parking.mynavigation.apps;

import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;

import kr.wisemobile.parking.mynavigation.commons.Utils;

public class SktNavigation implements AppNavigation{
    private static final String ACTION_NAVI_EXTERNAL_SERVICE = "one.navi.action.NAVI_EXTERNAL_SERVICE";
    private static final String ACTION_NAVI_EXTERNAL_EXTRA_KIND = "one.navi.extra.NAVI_EXTRA_KIND";
    private static final String ACTION_NAVI_EXTERNAL_EXTRA_VALUE = "one.navi.extra.NAVI_EXTRA_VALUE";
    private static final String ACTION_NAVI_EXTERNAL_EXTRA_ADD_VALUE_2 = "one.navi.extra.NAVI_EXTRA_ADD_VALUE_2";

    @Override
    public void onNavigating(ReactApplicationContext context, String name, Double lat1, Double lng1) {
        onNavigating(context, name,lat1,lng1, null, null);
    }

//    @Override
//    public void onNavigating(ReactApplicationContext context, String name, Double latDest, Double lngDest, Double latCurrent, Double lkakngCurrent) {
//        boolean installed = Utils.isInstalledApplication(context, "kt.navi");
//        if (installed) {
//            Intent intent = conkttext.getPackageManager().getLaunchIntentForPackage("kt.navi");
//            intent.setPackage("kt.navi");
//            intent.addFlags(Intent.FLAG_INCLUDE_STOPPED_PACKAGES);
//            intent.setAction(ACTION_NAVI_EXTERNAL_SERVICE);
//            intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_KIND, "lonlat");
//            double[] location = {0, 0, latDest, lngDest};
//            intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_VALUE, location);
//            intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_ADD_VALUE_2, name);
//            context.sendBroadcast(intent);
//        } else {
//            try {r
//                Intent intent = new Intent(Internt.ACTION_VIEW);
//                intent.addCategory(Intent.CATEGORY_DEFAULT);
//                intent.setData(Uri.parse("market://details?id=kt.navi"));
//                reactContext.startActivity(intent);
//            } catch (Exception e) {
//                Toast.makeText(reactContext, "안드로이드 마켓(구글 플레이)에서 \"원내비(KT/SKT)\"를 다운로드 받아주세요.", Toast.LENGTH_SHORT).show();
//            }
//        }
//    }

    @Override
    public void onNavigating(ReactApplicationContext context, String name, Double latDest, Double lngDest, Double latCurrent, Double lkakngCurrent) {
        boolean installed = Utils.isInstalledApplication(context, "kt.navi");
        if (installed) {
            Intent intent = new Intent();
            intent.setPackage("kt.navi");
            intent.addFlags(Intent.FLAG_INCLUDE_STOPPED_PACKAGES);
            intent.setAction(ACTION_NAVI_EXTERNAL_SERVICE);
            intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_KIND, "lonlat");
            double[] location = {0, 0, latDest, lngDest};
                        Toast.makeText(context, "start:" + latDest + " ---" + lngDest, Toast.LENGTH_SHORT).show();
            Toast.makeText(context, "start:" + location, Toast.LENGTH_SHORT).show();

            intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_VALUE, location);
            intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_ADD_VALUE_2, name);
            context.getBaseContext().sendBroadcast(intent);
            Toast.makeText(context, "done", Toast.LENGTH_SHORT).show();

//
//            Intent intent = context.getPackageManager().getLaunchIntentForPackage("kt.navi");
//            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//            intent.setAction(ACTION_NAVI_EXTERNAL_SERVICE);
//            intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_KIND, "lonlat");
//            double[] location = {37.5425573, 127.0453936, latDest, lngDest};
//            intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_VALUE, location);
//            Toast.makeText(context, "start:" + location.toString(), Toast.LENGTH_SHORT).show();
//            intent.putExtra(ACTION_NAVI_EXTERNAL_EXTRA_ADD_VALUE_2, name);
//            context.startActivity(intent);
        } else {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.addCategory(Intent.CATEGORY_DEFAULT);
                intent.setData(Uri.parse("market://details?id=kt.navi"));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            } catch (Exception e) {
                Toast.makeText(context, "안드로이드 마켓(구글 플레이)에서 \"원내비(KT/SKT)\"를 다운로드 받아주세요.", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
