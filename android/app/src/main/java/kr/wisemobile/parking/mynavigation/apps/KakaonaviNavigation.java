package kr.wisemobile.parking.mynavigation.apps;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.kakao.sdk.navi.NaviClient;
import com.kakao.sdk.navi.model.CoordType;
import com.kakao.sdk.navi.model.Location;
import com.kakao.sdk.navi.model.NaviOption;

import kr.wisemobile.parking.mynavigation.commons.Utils;

public class KakaonaviNavigation implements AppNavigation{
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
        PackageManager pm = context.getPackageManager();
        PackageInfo pi;
        try {
            String strAppPackage = "com.locnall.KimGiSa";
            pi = pm.getPackageInfo(strAppPackage, PackageManager.GET_ACTIVITIES);
        } catch (PackageManager.NameNotFoundException e) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.addCategory(Intent.CATEGORY_DEFAULT);
                intent.setData(Uri.parse("market://details?id=com.locnall.KimGiSa"));
                context.startActivity(intent);
            } catch (Exception e1) {
                Toast.makeText(context, "안드로이드 마켓(구글 플레이)에서 \"카카오내비\"를 다운로드 받아주세요.", Toast.LENGTH_LONG).show();
            }
            return;
        }
//                    Intent intent = new Intent(Intent.ACTION_VIEW);
//                    intent.setClassName("com.locnall.KimGiSa", "com.locnall.KimGiSa.Engine.SMS.CremoteActivity");
//                    intent.setData(Uri.parse("kimgisa://addPOI?name=" + mItem.getGarageName() + "&coord_type=wgs84&pos_x=" + mItem.getLng() + "&pos_y=" + mItem.getLat() + "&key=c3ed7114852a41e1a77e821d1f9ffc20"));
//                    Log.e(TAG, ""+Uri.parse("kimgisa://addPOI?name=" + mItem.getGarageName() + "&coord_type=wgs84&pos_x=" + mItem.getLng() + "&pos_y=" + mItem.getLat() + "&key=c3ed7114852a41e1a77e821d1f9ffc20"));

        context.startActivity(NaviClient.getInstance().navigateIntent(
                new Location(name, lngDest.toString(), latDest.toString()),
                new NaviOption(CoordType.WGS84)
        ));
    }
}
