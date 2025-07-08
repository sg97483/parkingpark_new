# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.kakao.sdk.**.model.* { <fields>; }
-keep class * extends com.google.gson.TypeAdapter
# https://github.com/square/okhttp/pull/6792
-dontwarn org.bouncycastle.jsse.**
-dontwarn org.conscrypt.*
-dontwarn org.openjsse.**
-keep public class com.nhn.android.naverlogin.** {
       public protected *;
}
-keep class com.yourpackage.path.to.PersistentTrustedChimeraReceiver { *; }
-keep class io.realm.react.**
-keep public class com.google.firebase.** { *; }
-keep class com.google.android.gms.internal.** { *; }
-keepclasseswithmembers class com.google.firebase.FirebaseException

 # With R8 full mode generic signatures are stripped for classes that are not 
 # kept. Suspend functions are wrapped in continuations where the type argument 
 # is used. 
 -keep,allowobfuscation,allowshrinking class kotlin.coroutines.Continuation 
  
 # R8 full mode strips generic signatures from return types if not kept. 
 -if interface * { @retrofit2.http.* public *** *(...); } 
 -keep,allowoptimization,allowshrinking,allowobfuscation class <3> 
  
 # With R8 full mode generic signatures are stripped for classes that are not kept. 
 -keep,allowobfuscation,allowshrinking class retrofit2.Response 


# To use naver login with proguard
-keep public class com.navercorp.nid.oauth.** {*;}

# To use naver login profile with proguard
-keep public class com.navercorp.nid.profile.data.** {*;}