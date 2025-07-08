package kr.wisemobile.parking.mynavigation.commons;

import android.content.Context;
import android.content.pm.PackageManager;

public class Utils {
    public static boolean isInstalledApplication(Context context, String packageName) {
        PackageManager pm = context.getPackageManager();
        try {
            pm.getPackageInfo(packageName, 0);
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
        return true;
    }
}
