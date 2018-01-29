package com.ixosign;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

public class ActivityCompletionModule extends ReactContextBaseJavaModule {

    public ActivityCompletionModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ActivityCompletion";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("OK", Activity.RESULT_OK);
        map.put("CANCELED", Activity.RESULT_CANCELED);
        return map;
    }

    @ReactMethod
    public void finish(int result, String action, ReadableMap map) {
        Activity activity = getReactApplicationContext().getCurrentActivity();
        Intent intent = new Intent(action);
        intent.putExtras(Arguments.toBundle(map));
        activity.setResult(result, intent);
        activity.finish();
    }
}
