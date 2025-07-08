import Foundation
import UIKit

@objc(TmapNavigationModule)
class TmapNavigationModule: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc func navigateToTmap(_ arriveAdressName: String, lat: Double, long: Double) {
    guard let url = URL(string: "tmap://route?goalname=\(arriveAdressName)&goalx=\(long)&goaly=\(lat)") else {
      return
    }

    DispatchQueue.main.async {
      if UIApplication.shared.canOpenURL(url) {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
      } else {
        // 티맵이 없으면 앱스토어로 이동
        if let appStoreUrl = URL(string: "https://apps.apple.com/kr/app/tmap/id431589174") {
          UIApplication.shared.open(appStoreUrl, options: [:], completionHandler: nil)
        }
      }
    }
  }
}
