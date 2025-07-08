package kr.wisemobile.parking; // 패키지 이름은 기존과 동일하게 유지

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle; // RNBootSplash를 위해 추가
import com.zoontek.rnbootsplash.RNBootSplash; // RNBootSplash를 위해 추가

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "ParkingPark" // 본인 프로젝트 이름

  /**
   * RNBootSplash를 적용하기 위해 onCreate 함수를 오버라이드합니다.
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this, R.style.BootSplashTheme); // ✅ 이 코드를 super.onCreate() 보다 먼저 호출
    super.onCreate(savedInstanceState)
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}