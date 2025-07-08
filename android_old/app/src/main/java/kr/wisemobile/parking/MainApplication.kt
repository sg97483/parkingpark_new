package kr.wisemobile.parking

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.tnkfactory.ad.AdConfiguration
import java.util.List

// 수동으로 추가할 커스텀 패키지들을 import 합니다.
import kr.wisemobile.parking.mynavigation.MyNavigationPackage
import kr.wisemobile.parking.mytnkads.MyTnkAdsPackage

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override fun getPackages(): List<ReactPackage> {
          // PackageList를 사용하여 자동으로 연결된 패키지 목록을 가져옵니다.
          val packages: MutableList<ReactPackage> = PackageList(this).packages
          
          // 자동 연결이 안되는 커스텀 패키지만 수동으로 추가합니다.
          packages.add(MyNavigationPackage())
          packages.add(MyTnkAdsPackage())
          
          return packages
        }

        override fun getJSMainModuleName(): String = "index"

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)

    if (BuildConfig.DEBUG) {
      AdConfiguration.setPublisherId(this, "a0e08060102148777784110f0e000c0f")
    } else {
      AdConfiguration.setPublisherId(this, "8020400070c1387777831c05070c000e")
    }

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      load()
    }
  }
}