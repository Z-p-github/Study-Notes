最近由于公司内部需求，之前用`flutter`开发了一款`app应用`，本次需要做消息推送的功能，所谓消息推送功能，就是`app`端能够接收到 平台的推送信息，然后在手机上面提示出来，或者可以在`app`图标右上角显示一个未读的消息数量，类似于如下图这种功能：

<img src='@assets/flutter_msg/one.png' alt="center"  height="150" />
<img src='@assets/flutter_msg/two.jpg' alt="center"  height="150" />

本次我就以接入小米的`推送sdk`为例来进行讲解，要想完成小米的`sdk`接入并一个完整的推送流程需要完成以下几个步骤：

- 1、注册[小米开发平台](https://dev.mi.com/platform)账号 
- 2、上架 `app`
- 3、`Flutter`端接入小米推送`sdk`
- 4、`Flutter`端实现与sdk通信，处理逻辑
- 4、`Flutter`端将 获取到的`regId`传递给后端服务，用于后续后端服务发送推送消息
- 5、服务端保存app应用端传递过来的 `regId`，并且接入小米推送服务，给指定`regId`的应用或者全部应用发送消息

下面我们说说如何在`flutter`端接入小米推送sdk，并且获取到推送消息:

我们可以在此处查看相关的[接入步骤](https://dev.mi.com/distribute/doc/details?pId=1544).

#### 下载MiPush Android客户端SDK软件包

`MiPush Android客户端SDK`从`5.0.1`版本开始，提供`AAR`包接入方式，其支持的最低`Android SDK`版本为`19`,

[sdk下载地址](https://admin.xmpush.xiaomi.com/zh_CN/mipush/downpage);

下载下来之后可以先放在一个文件夹中：

<img src='@assets/flutter_msg/xiaomi_sdk.png' alt="center"  height="150" />

#### 配置 `build.gradle`

在安卓开发中，`build.gradle` 文件是一个用于配置和构建 `Android` 项目的重要文件。它是 `Gradle` 构建系统的配置文件，用于定义项目的构建设置和依赖关系。


```js
//android 块中的 repositories 部分，通过配置 flatDir 仓库，指定了一个本地目录 'libs'。这意味着在该目录下的库文件（如 .aar 文件）可以被项目引用。
android{
    repositories {
        flatDir {
            dirs 'libs'
        }
    }
}
// implementation 关键字引用sdk 
dependencies {
    implementation (name: 'MiPush_SDK_Client_xxx', ext: 'aar')
}
```

#### 引入推送代码

相关常量文件 `XiaomiBaseConstants.java`
```java
package xxxx;

public class XiaomiBaseConstants {

    //日志tag
    public static final String TAG="xxx";

    //小米后台的App_ID
    public static final String APP_ID="APP_ID";
    //小米后台的App_KEY
    public static final String APP_KEY="APP_KEY";


    //Flutter 和Android  互相通信的通道
    public static final String PUSH_MSG_METHOD_CHANEL="com.push.xiaomi.msg.method";
    public static final String PUSH_MSG_EVENT_CHANEL="com.push.xiaomi.msg.event";

}
```

注册推送服务

通过调用`MiPushClient.registerPush`来注册小米推送服务。注册成功后，您可以在自定义的`onCommandResult和onReceiveRegisterResult`中收到注册结果，其中的regId即是当前设备上当前app的唯一标示。您可以将regId上传到自己的服务器，方便向其发消息。

为了提高push的注册率，您可以在 `Application的onCreate中注册push`。您也可以根据需要，在其他地方注册`push`

```java
package xxx;

import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;
import android.app.Application;
import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.os.Process;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.xiaomi.channel.commonutils.logger.LoggerInterface;
import com.xiaomi.mipush.sdk.Logger;
import com.xiaomi.mipush.sdk.MiPushClient;

import java.util.List;


public class XiaomiMessagePushApplication extends Application {

    // user your appid the key.
    private static final String APP_ID = XiaomiBaseConstants.APP_ID;
    // user your appid the key.
    private static final String APP_KEY = XiaomiBaseConstants.APP_KEY;

    // 此TAG在adb logcat中检索自己所需要的信息， 只需在命令行终端输入 adb logcat | grep
    // com.tongcheng.tcqf
    public static final String TAG = XiaomiBaseConstants.TAG;

    private static DemoHandler sHandler = null;
    private static MainActivity sMainActivity = null;

    @Override
    public void onCreate() {
        super.onCreate();

        // 注册push服务，注册成功后会向XiaomiMessagePush发送广播
        // 可以从XiaomiMessagePush的onCommandResult方法中MiPushCommandMessage对象参数中获取注册信息
        if (isMainProcess()) {
            //此处需要判断是不是小米
            MiPushClient.registerPush(this, APP_ID, APP_KEY);
        }

        LoggerInterface newLogger = new LoggerInterface() {

            @Override
            public void setTag(String tag) {
                // ignore
            }

            @Override
            public void log(String content, Throwable t) {
                Log.d(TAG, content, t);
            }

            @Override
            public void log(String content) {
                Log.d(TAG, content);
            }
        };
        Logger.setLogger(this, newLogger);
        if (sHandler == null) {
            sHandler = new DemoHandler(getApplicationContext());
        }
    }
    //判断是否在主线程
    private boolean isMainProcess() {
        ActivityManager am = ((ActivityManager) getSystemService(Context.ACTIVITY_SERVICE));
        List<RunningAppProcessInfo> processInfos = am.getRunningAppProcesses();
        String mainProcessName = getPackageName();
        int myPid = Process.myPid();
        for (RunningAppProcessInfo info : processInfos) {
            if (info.pid == myPid && mainProcessName.equals(info.processName)) {
                return true;
            }
        }
        return false;
    }

    public static DemoHandler getHandler() {
        return sHandler;
    }

    public static void setMainActivity(MainActivity activity) {
        //保存主活动的上下文
        sMainActivity = activity;
    }

    //继承handler，用于处理消息
    //在安卓中Handler 主要用于消息传递和处理
    public static class DemoHandler extends Handler {

        private Context context;

        public DemoHandler(Context context) {
            this.context = context;
        }
        //重写 handleMessage方法
        @Override
        public void handleMessage(Message msg) {
            String s = (String) msg.obj;
            if (sMainActivity != null && sMainActivity.eventSink != null) {
                //调用主活动的 eventChannel向flutter端发送消息
                sMainActivity.eventSink.success(s);
            }
            if (!TextUtils.isEmpty(s)) {
                Toast.makeText(context, s, Toast.LENGTH_LONG).show();
            }
        }
    }
}
```


推送相关代码，定义一个类接收推送消息，`XiaomiMessagePush.java`

```java
package xxxx;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.content.SharedPreferences;

import com.xiaomi.mipush.sdk.ErrorCode;
import com.xiaomi.mipush.sdk.MiPushClient;
import com.xiaomi.mipush.sdk.MiPushCommandMessage;
import com.xiaomi.mipush.sdk.MiPushMessage;
import com.xiaomi.mipush.sdk.PushMessageReceiver;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * 1、PushMessageReceiver 是个抽象类，该类继承了 BroadcastReceiver。<br/>
 * 2、需要将自定义的 XiaomiMessagePush 注册在 AndroidManifest.xml 文件中：
 * <pre>
 * {@code
 *  <receiver
 *      android:name="com.xiaomi.mipushdemo.XiaomiMessagePush"
 *      android:exported="true">
 *      <intent-filter>
 *          <action android:name="com.xiaomi.mipush.RECEIVE_MESSAGE" />
 *      </intent-filter>
 *      <intent-filter>
 *          <action android:name="com.xiaomi.mipush.MESSAGE_ARRIVED" />
 *      </intent-filter>
 *      <intent-filter>
 *          <action android:name="com.xiaomi.mipush.ERROR" />
 *      </intent-filter>
 *  </receiver>
 *  }</pre>
 * 3、XiaomiMessagePush 的 onReceivePassThroughMessage 方法用来接收服务器向客户端发送的透传消息。<br/>
 * 4、XiaomiMessagePush 的 onNotificationMessageClicked 方法用来接收服务器向客户端发送的通知消息，
 * 这个回调方法会在用户手动点击通知后触发。<br/>
 * 5、XiaomiMessagePush 的 onNotificationMessageArrived 方法用来接收服务器向客户端发送的通知消息，
 * 这个回调方法是在通知消息到达客户端时触发。另外应用在前台时不弹出通知的通知消息到达客户端也会触发这个回调函数。<br/>
 * 6、XiaomiMessagePush 的 onCommandResult 方法用来接收客户端向服务器发送命令后的响应结果。<br/>
 * 7、XiaomiMessagePush 的 onReceiveRegisterResult 方法用来接收客户端向服务器发送注册命令后的响应结果。<br/>
 * 8、以上这些方法运行在非 UI 线程中。
 *
 * @author mayixiang
 */
public class XiaomiMessagePush extends PushMessageReceiver {

    private String mRegId;
    private String mTopic;
    private String mAlias;
    private String mAccount;
    private String mStartTime;
    private String mEndTime;

    @Override
    public void onReceivePassThroughMessage(Context context, MiPushMessage message) {
        super.onReceivePassThroughMessage(context, message);
        Log.v(XiaomiMessagePushApplication.TAG,
                "onReceivePassThroughMessage is called. " + message.toString());
        String log = context.getString(R.string.recv_passthrough_message, message.getContent());

        if (!TextUtils.isEmpty(message.getTopic())) {
            mTopic = message.getTopic();
        } else if (!TextUtils.isEmpty(message.getAlias())) {
            mAlias = message.getAlias();
        }

        Message msg = Message.obtain();
        msg.obj = message.getContent();
        //发送数据
        XiaomiMessagePushApplication.getHandler().sendMessage(msg);
    }

    @Override
    public void onNotificationMessageClicked(Context context, MiPushMessage message) {
        Log.v(XiaomiMessagePushApplication.TAG,
                "onNotificationMessageClicked is called. " + message.toString());
        String log = context.getString(R.string.click_notification_message, message.getContent());

        if (!TextUtils.isEmpty(message.getTopic())) {
            mTopic = message.getTopic();
        } else if (!TextUtils.isEmpty(message.getAlias())) {
            mAlias = message.getAlias();
        }

        Message msg = Message.obtain();
        if (message.isNotified()) {
            msg.obj = log;
        }
         //发送数据
        XiaomiMessagePushApplication.getHandler().sendMessage(msg);
    }

    @Override
    public void onNotificationMessageArrived(Context context, MiPushMessage message) {
        super.onNotificationMessageArrived(context, message);
        Log.v(XiaomiMessagePushApplication.TAG,
                "onNotificationMessageArrived is called. " + message.toString());
        String log = context.getString(R.string.arrive_notification_message, message.getContent());

        if (!TextUtils.isEmpty(message.getTopic())) {
            mTopic = message.getTopic();
        } else if (!TextUtils.isEmpty(message.getAlias())) {
            mAlias = message.getAlias();
        }

        Message msg = Message.obtain();
        msg.obj = message.getContent();
         //发送数据
        XiaomiMessagePushApplication.getHandler().sendMessage(msg);
    }

    @Override
    public void onCommandResult(Context context, MiPushCommandMessage message) {
        Log.d(XiaomiMessagePushApplication.TAG,
                "onCommandResult is called. " + message.toString());
        String command = message.getCommand();
        List<String> arguments = message.getCommandArguments();
        String cmdArg1 = ((arguments != null && arguments.size() > 0) ? arguments.get(0) : null);
        String cmdArg2 = ((arguments != null && arguments.size() > 1) ? arguments.get(1) : null);
        String log;
        if (MiPushClient.COMMAND_REGISTER.equals(command)) {
            if (message.getResultCode() == ErrorCode.SUCCESS) {
                mRegId = cmdArg1;
                log = context.getString(R.string.register_success);
            } else {
                log = context.getString(R.string.register_fail) ;
            }
        } else if (MiPushClient.COMMAND_SET_ALIAS.equals(command)) {
            if (message.getResultCode() == ErrorCode.SUCCESS) {
                mAlias = cmdArg1;
                log = context.getString(R.string.set_alias_success, mAlias);
            } else {
                log = context.getString(R.string.set_alias_fail, message.getReason());
            }
        } else if (MiPushClient.COMMAND_UNSET_ALIAS.equals(command)) {
            if (message.getResultCode() == ErrorCode.SUCCESS) {
                mAlias = cmdArg1;
                log = context.getString(R.string.unset_alias_success, mAlias);
            } else {
                log = context.getString(R.string.unset_alias_fail, message.getReason());
            }
        } else if (MiPushClient.COMMAND_SET_ACCOUNT.equals(command)) {
            if (message.getResultCode() == ErrorCode.SUCCESS) {
                mAccount = cmdArg1;
                log = context.getString(R.string.set_account_success, mAccount);
            } else {
                log = context.getString(R.string.set_account_fail, message.getReason());
            }
        } else if (MiPushClient.COMMAND_UNSET_ACCOUNT.equals(command)) {
            if (message.getResultCode() == ErrorCode.SUCCESS) {
                mAccount = cmdArg1;
                log = context.getString(R.string.unset_account_success, mAccount);
            } else {
                log = context.getString(R.string.unset_account_fail, message.getReason());
            }
        } else if (MiPushClient.COMMAND_SUBSCRIBE_TOPIC.equals(command)) {
            if (message.getResultCode() == ErrorCode.SUCCESS) {
                mTopic = cmdArg1;
                log = context.getString(R.string.subscribe_topic_success, mTopic);
            } else {
                log = context.getString(R.string.subscribe_topic_fail, message.getReason());
            }
        } else if (MiPushClient.COMMAND_UNSUBSCRIBE_TOPIC.equals(command)) {
            if (message.getResultCode() == ErrorCode.SUCCESS) {
                mTopic = cmdArg1;
                log = context.getString(R.string.unsubscribe_topic_success, mTopic);
            } else {
                log = context.getString(R.string.unsubscribe_topic_fail, message.getReason());
            }
        } else if (MiPushClient.COMMAND_SET_ACCEPT_TIME.equals(command)) {
            if (message.getResultCode() == ErrorCode.SUCCESS) {
                mStartTime = cmdArg1;
                mEndTime = cmdArg2;
                log = context.getString(R.string.set_accept_time_success, mStartTime, mEndTime);
            } else {
                log = context.getString(R.string.set_accept_time_fail, message.getReason());
            }
        } else {
            log = message.getReason();
        }

        Message msg = Message.obtain();
        msg.obj = log;
        XiaomiMessagePushApplication.getHandler().sendMessage(msg);
    }

    @Override
    public void onReceiveRegisterResult(Context context, MiPushCommandMessage message) {
        Log.v(XiaomiMessagePushApplication.TAG,
                "onReceiveRegisterResult is called. " + message.toString());
        String command = message.getCommand();
        List<String> arguments = message.getCommandArguments();
        String cmdArg1 = ((arguments != null && arguments.size() > 0) ? arguments.get(0) : null);
        String log;
        if (MiPushClient.COMMAND_REGISTER.equals(command)) {
            if (message.getResultCode() == ErrorCode.SUCCESS) {
                mRegId = cmdArg1;
                log = context.getString(R.string.register_success) + cmdArg1;
                //保存RegisId
                saveRegisterId(context,mRegId);
            } else {
                log = context.getString(R.string.register_fail);
            }
        } else {
            log = message.getReason();
        }

        Message msg = Message.obtain();
        msg.obj = log;
        XiaomiMessagePushApplication.getHandler().sendMessage(msg);
    }

    @SuppressLint("SimpleDateFormat")
    private static String getSimpleDate() {
        return new SimpleDateFormat("MM-dd hh:mm:ss").format(new Date());
    }

        //保存参数 保存regId
    private void saveRegisterId(Context context,String regId){
         if(null==context||regId.isEmpty())return;
         //用于存储数据
        SharedPreferences preferences = context.getSharedPreferences(BaseConstants.DATA_Reg,Context.MODE_PRIVATE);
        // 获取一个可编辑的 Editor 对象
        SharedPreferences.Editor editor= preferences.edit();
        //将注册推送标识 regId 存储到 SharedPreferences 中，使用名为 BaseConstants.RegIdTag 的键
        editor.putString(BaseConstants.RegIdTag,regId);
        //提交编辑操作，将数据保存到 SharedPreferences 中。
        editor.commit();
    }

}

```

接下来需要在你的`MainActivity.java`文件中修改相关代码，需要初始化相关的`eventChannel`和`methodChannel`，这样才能和`flutter`端通信；

- `eventChannel` 用于在 `Flutter` 和安卓原生之间进行事件的单向通信。通过 `EventChannel`，安卓原生代码可以向 `Flutter` 发送事件，而 `Flutter` 可以通过监听事件通道接收这些事件
- `methodChannel` 用于在 `Flutter` 和安卓原生之间进行双向通信。通过 `MethodChannel`,`Flutter` 可以调用安卓原生代码的方法，并获取返回结果。同时，安卓原生代码也可以通过 `MethodChannel` 向 `Flutter` 发送消息。

`MainActivity.java`

```java
package xxx;

import android.util.Log;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.app.AlertDialog;
import android.view.View.OnClickListener;
import android.content.DialogInterface;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import android.widget.Toast;
import android.content.SharedPreferences;
import android.content.Context;
import android.os.Handler;
import android.os.Build;
import com.flutter.tc_flutter_webview.ActivityResultListener;
import com.flutter.tc_flutter_webview.TcFlutterWebviewHelp;
import com.flutter.tc_flutter_webview.TcPermissionsResultListener;
import com.flutter.tc_flutter_webview.TcWebViewDelegate;
import io.flutter.plugin.common.EventChannel;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugin.common.MethodCall;
import android.widget.EditText;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import com.xiaomi.mipush.sdk.MiPushClient;

import io.flutter.embedding.android.FlutterActivity;
import io.flutter.embedding.android.FlutterView;

public class MainActivity extends FlutterActivity implements TcWebViewDelegate {

    public EventChannel.EventSink eventSink;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //获取设备信息
        _getDeviceInfo();
    }

    //获取消息逻辑
    private String getPushReceiveMsg() {
        SharedPreferences preferences = getSharedPreferences(BaseConstants.DATA_Push, Context.MODE_PRIVATE);
        String data = preferences.getString(BaseConstants.PushTag, "");
        SharedPreferences.Editor editor = preferences.edit();

        //清理数据
        if (!data.isEmpty()) {
            editor.remove(BaseConstants.PushTag);
            editor.commit();
        }
        return data;

    }



    public void initChannel(String eventChannelName,String methodChannelName,String DATA_Reg,String RegIdTag,String DATA_Push,String PushTag){
        //初始化EventChannel，用于通过 eventSink 向flutter端发送消息，flutter端需要通过receiveBroadcastStream来接收
        new EventChannel(getFlutterEngine().getDartExecutor().getBinaryMessenger(), eventChannelName).setStreamHandler(
        new EventChannel.StreamHandler() {
                    //onListen 方法会在 Flutter 端开始监听事件通道时执行。具体地说，当你在 Flutter 代码中调用 //  EventChannel 实例的 receiveBroadcastStream() 方法来监听事件通道时，onListen 方法会被触发
                    @Override
                    public void onListen(Object arguments, EventChannel.EventSink events) {
                        // 初始化
                        eventSink = events;
                    }
                    @Override
                    public void onCancel(Object arguments) {
                    }
                }
        );
        

        //注册方法通道MethodChannel
        new MethodChannel(
                getFlutterEngine().getDartExecutor().getBinaryMessenger(), methodChannelName
        ).setMethodCallHandler(
                new MethodChannel.MethodCallHandler() {
                    //监听方法调用
                    @Override
                    public void onMethodCall(@NonNull MethodCall call, @NonNull MethodChannel.Result result) {

                        if (call.method.equals("getReciveData")) {
                            String content = getPushReceiveMsg();
                            result.success(content);
                        } else if (call.method.equals("getXiaoMiRegId")) {
                            String regId = getRegId();
                            if (!regId.isEmpty()) {
                                result.success(regId);
                            }else {
                                result.success("没有获取到RegId");
                            }
                        } else {
                            result.notImplemented();
                        }
                    }
                }
        );
        //存贮 从被杀死的应用点击通知，传进来的参数
         saveIntentData(getIntent());

    }

    public void _getDeviceInfo(){
        //获取设备信息
        String manufacturer = Build.MANUFACTURER;
        switch (manufacturer){
            case "XIAOMI":
                // 处理小米的逻辑
                initChannel(XiaomiBaseConstants.PUSH_MSG_EVENT_CHANEL,XiaomiBaseConstants.PUSH_MSG_METHOD_CHANEL,BaseConstants.DATA_Reg,BaseConstants.RegIdTag,BaseConstants.DATA_Push,BaseConstants.PushTag);
                break;
            case "OPPO":
                // 处理OPPO的逻辑
                break;
            case "VIVO":
                 // 处理VIVO的逻辑
                break;
        }
    }


    //存储消息的逻辑
    private void saveIntentData(Intent intent) {
        if (null != intent && intent.getExtras() != null && intent.getStringExtra(BaseConstants.Extras) != null) {
            String content = intent.getStringExtra(BaseConstants.Extras);
            Log.d(BaseConstants.TAG, "save receive data from push, data = " + content);
            SharedPreferences preferences = getSharedPreferences(BaseConstants.DATA_Push, Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = preferences.edit();
            editor.putString(BaseConstants.PushTag, content);
            editor.commit();

        } else {
            Log.d(BaseConstants.TAG, "存储消息错误");
        }

    }
    //获取注册Id
    private String getRegId(){
        SharedPreferences preferences = getSharedPreferences(BaseConstants.DATA_Reg, Context.MODE_PRIVATE);
        String data = preferences.getString(BaseConstants.RegIdTag, "");
        Log.d(XiaomiBaseConstants.TAG, "getReciveData"+data);
        return data;
    }


    @Override
    protected void onNewIntent(@NonNull Intent intent) {
        super.onNewIntent(intent);
         Log.d(XiaomiBaseConstants.TAG, "onNewIntent");
        Log.d(XiaomiBaseConstants.TAG, intent.toString());
        //应用处于前台时，直接通过eventChanel 通知flutter

        //获取intentData
        getIntentData(intent);
    }

    //获取intentData
    private void getIntentData(Intent intent) {
        if (null != intent && intent.getExtras() != null && intent.getStringExtra(BaseConstants.Extras) != null) {

            String content = intent.getStringExtra(BaseConstants.Extras);
            Log.d(XiaomiBaseConstants.TAG, "save receive data from push, data = " + content);

            pushMsgEvent(content);
        } else {
            Log.d(XiaomiBaseConstants.TAG, "intent is null");
        }

    }

   //发送消息至flutter
    private void pushMsgEvent(String content) {
        new Handler().postDelayed(
                new Runnable() {
                    @Override
                    public void run() {
                        if (eventSink != null) {
                            //发送消息
                            eventSink.success(content);
                        }
                    }
                }
                , 500);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        //注销
        XiaomiMessagePushApplication.setMainActivity(null);
    }
}

```



#### 配置 `AndroidManifest`
接下来我们需要配置`AndroidManifest.xml`

```xml
   <!-- xiao mi service  -->
        <service
            android:name="com.xiaomi.push.service.XMPushService"
            android:enabled="true"
            android:process=":pushservice" />

        <!--注：此service必须在3.0.1版本以后（包括3.0.1版本）加入-->
        <service
            android:name="com.xiaomi.push.service.XMJobService"
            android:enabled="true"
            android:exported="false"
            android:permission="android.permission.BIND_JOB_SERVICE"
            android:process=":pushservice" />

        <service
            android:name="com.xiaomi.mipush.sdk.PushMessageHandler"
            android:enabled="true"
            android:exported="true" />

        <!--注：此service必须在2.2.5版本以后（包括2.2.5版本）加入-->
        <service
            android:name="com.xiaomi.mipush.sdk.MessageHandleService"
            android:enabled="true" />

        <receiver
            android:name="com.xiaomi.push.service.receivers.NetworkStatusReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </receiver>

        <!-- //声明一个接收小米推送消息的广播接收器 -->
        <receiver
          android:exported="true"
          android:name="com.tongcheng.tcqf.XiaomiMessagePush">
          <intent-filter>
            <action android:name="com.xiaomi.mipush.RECEIVE_MESSAGE" />
          </intent-filter>
            <intent-filter>
            <action android:name="com.xiaomi.mipush.MESSAGE_ARRIVED" />
          </intent-filter>
          <intent-filter>
            <action android:name="com.xiaomi.mipush.ERROR" />
          </intent-filter>
        </receiver>
```


#### `flutter`端接受消息



```dart
import 'dart:io';

import 'package:myPackage/http/app_service.dart';
import 'package:myPackage/utils/app_badger_util.dart';
import 'package:flutter/services.dart';
import 'package:device_info_plus/device_info_plus.dart';

//小米
class Xiaomi_Push_Event_Channel {
  String Xiaomi_PUSH_MSG_METHOD_CHANEL = "com.push.xiaomi.msg.method";
  String Xiaomi_PUSH_MSG_EVENT_CHANEL = "com.push.xiaomi.msg.event";
  String Xiaomi_RegId_Event = "getXiaoMiRegId";
  String Xiaomi_ReceiveData_Event = "getReciveData";

  late MethodChannel methodChannel;

  Future<void> initChanel() async {
    methodChannel = MethodChannel(Xiaomi_PUSH_MSG_METHOD_CHANEL);
    EventChannel XiaoMiEventChannel =
        EventChannel(Xiaomi_PUSH_MSG_EVENT_CHANEL);

    //注册监听
    XiaoMiEventChannel.receiveBroadcastStream().listen((dynamic msgData) async {
      print("XiaoMiDataChannel ---->" + msgData.toString());
      //跳转自己的页面逻辑
      App_Message_Badger.setNewMessageBadgeCount('new');
      // doSomeThing();
    }, onError: (Object error) {
      print("XiaoMiDataChannel---->" + error.toString());
    });
  }

  Future<String> getXiaoMiRegId() async {
    //方法名也和Android定义的一至
    String regId = await methodChannel.invokeMethod(Xiaomi_RegId_Event);
    print('regId===${regId}');
    if (regId.isEmpty) {
      return '';
    } else {
      return regId;
    }
  }

  Future<String> getReciveData() async {
    //方法名也和Android定义的一至
    String receiveData =
        await methodChannel.invokeMethod(Xiaomi_ReceiveData_Event);
    print('reciveData===${receiveData}');
    if (receiveData.isEmpty) {
      return '';
    } else {
      return receiveData;
    }
  }
}

class Push_Event_channel {
  AppService appService = AppService();
  Push_Event_channel() {
    _init();
  }

  Future<String> _init() async {
    String manufacture = '';
    DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
    if (Platform.isIOS) {
      manufacture = 'APPLE';
      //ios相关代码
    } else {
      AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo;
      switch (androidInfo.manufacturer) {
        case 'HUAWEI':
          manufacture = 'HW';
          Xiaomi_Push_Event_Channel xiaomi_channel =
              Xiaomi_Push_Event_Channel();
          await xiaomi_channel.initChanel();
          String regId = await xiaomi_channel.getXiaoMiRegId();
          print('获取到的华为==》小米推送id：${regId}');
          // _registerInfoToService(regId, manufacture);
          // print('获取到的华为==》小米推送id：${regId}');
          break;
        case 'XIAOMI':
          manufacture = 'MI';
          Xiaomi_Push_Event_Channel xiaomi_channel =
              Xiaomi_Push_Event_Channel();
          await xiaomi_channel.initChanel();
          String regId = await xiaomi_channel.getXiaoMiRegId();
          print('获取到的小米推送id：${regId}');
          break;
        case "OPPO":
          manufacture = 'OPPO';
          break;
        case "VIVO":
          manufacture = 'VIVO';
          break;
      }
      print('安卓设备:${androidInfo}');
    }
    return manufacture;
  }

//向服务端传递注册信息
  _registerInfoToService(String regId, String manufacture) {
    Map<String, String> params = {"mobileType": manufacture, "regId": regId};
    appService.registerAppAndDeviceInfo(params, (data) {
      print('app注册成功 ${data}');
    });
  }
}
```

接入成功后，我们就可以在小米的开发者后台中来测试，可以向指定的`regId`发送推送消息

<img src='@assets/flutter_msg/push.png' alt="center"  height="250" />