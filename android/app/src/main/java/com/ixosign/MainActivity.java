package com.ixosign;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "IxoSign";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new IxoSignReactActivityDelegate(this, getMainComponentName());
    }

    public static class IxoSignReactActivityDelegate extends ReactActivityDelegate {
        private final @Nullable Activity mActivity;
        private @Nullable Bundle mInitialProps;

        public IxoSignReactActivityDelegate(Activity activity, String mainComponentName) {
            super(activity, mainComponentName);
            this.mActivity = activity;
        }

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            mInitialProps = mActivity.getIntent().getExtras();
            super.onCreate(savedInstanceState);
        }

        @Override
        protected Bundle getLaunchOptions() {
            return mInitialProps;
        }
    }
}
