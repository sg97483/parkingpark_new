package kr.wisemobile.parking.mynavigation.apps;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;

import kr.wisemobile.parking.mynavigation.commons.Utils;

public class AtlanNavigation implements AppNavigation {
    @Override
    public void onNavigating(ReactApplicationContext context, String name, Double latDest, Double lngDest) {
        onNavigating(context,name,latDest,lngDest,null,null);
    }

    @Override
    public void onNavigating(ReactApplicationContext context, String name, Double latDest, Double lngDest, Double latCurrent, Double lngCurrent) {
        boolean installed = Utils.isInstalledApplication(context, "kr.mappers.AtlanSmart");

        if (installed) {
            try {
                Intent intent = context.getApplicationContext().getPackageManager().getLaunchIntentForPackage("kr.mappers.AtlanSmart");
                intent.setPackage("kr.mappers.AtlanSmart");
                intent.addFlags(Intent.FLAG_INCLUDE_STOPPED_PACKAGES);
                intent.setAction("kr.mappers.AtlanSmart.BMSG_TO_ATLAN");
                //intent.putExtra("TO_ATLAN_ACTION", "kr.mappers.AtlanSmart.BMSG_TO_ATLAN");
                intent.putExtra("PACKAGE", "kr.wisemobile.parking");
                intent.putExtra("TYPE", "ROUTE_REQ");
                intent.putExtra("AUTH0", "2b1ffc4c97acca5a359282739535a280bd6e8ae64e0dd7f2f5331c92bfbcde6c");
                intent.putExtra("AUTH1", "");
                intent.putExtra("AUTH2", "3.4.010");
                intent.putExtra("PARAM0", lngDest + ""); //경도
                intent.putExtra("PARAM1", latDest + ""); //위도
                intent.putExtra("PARAM2", name); //명칭
//                intent.putExtra("PARAM3", mItem.getAddressOld()); //주소
//                intent.putExtra("PARAM4", mItem.getPnum()); //전화번호
                context.startActivity(intent);
            } catch (Exception e) {
                Log.e("aa12", e.toString());
            }
        } else {
            try {
                //String market = Utils.readConfig(ActivityDetail.this, "kr.mappers.AtlanSmart");
                //if(market.equals(Constants.MARKET_GOOGLE)){
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.addCategory(Intent.CATEGORY_DEFAULT);
                intent.setData(Uri.parse("market://details?id=kr.mappers.AtlanSmart"));
                context.startActivity(intent);
                //}else{
                //	Toast.makeText(ActivityDetail.this, "안드로이드 마켓(구글 플레이)에서 \"아틀란 3D\"를 다운로드 받아주세요.", Toast.LENGTH_SHORT).show();
                //}
            } catch (Exception e) {
                Log.e("aa12", e.toString());
                Toast.makeText(context, "안드로이드 마켓(구글 플레이)에서 \"아틀란 3D\"를 다운로드 받아주세요.", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
