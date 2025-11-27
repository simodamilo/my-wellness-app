import OneSignal from "react-onesignal";

class NotificationService {
    private static initialized = false;

    static async init() {
        try {
            await OneSignal.init({
                appId: "a0c12360-ad8d-4247-ad67-7a40c79ccdae",
                serviceWorkerParam: { scope: "/my-wellness-app/" },
                serviceWorkerPath: "/my-wellness-app/OneSignalSDKWorker.js",
                allowLocalhostAsSecureOrigin: true,
                notifyButton: {
                    enable: true,
                    displayPredicate: () => true,
                    size: "medium",
                    position: "bottom-right",
                    prenotify: true,
                    showCredit: false,
                    text: {
                        "dialog.blocked.message": "",
                        "dialog.blocked.title": "",
                        "dialog.main.button.subscribe": "",
                        "dialog.main.button.unsubscribe": "",
                        "dialog.main.title": "",
                        "message.action.resubscribed": "",
                        "message.action.subscribed": "",
                        "message.action.subscribing": "",
                        "message.action.unsubscribed": "",
                        "message.prenotify": "",
                        "tip.state.blocked": "",
                        "tip.state.subscribed": "",
                        "tip.state.unsubscribed": "",
                    },
                },
            });

            // Wait for OneSignal to be fully initialized
            await OneSignal.User.init();
            this.initialized = true;

            OneSignal.User.PushSubscription.addEventListener("change", (event) => {
                const isSubscribed = event.current.optedIn;
                console.log("Push subscription state:", isSubscribed);
            });
        } catch (error) {
            console.error("Error initializing OneSignal:", error);
            this.initialized = false;
        }
    }

    static async requestPermission() {
        try {
            // Updated permission request method
            await OneSignal.Notifications.requestPermission();
            return true;
        } catch (error) {
            console.error("Error requesting notification permission:", error);
            return false;
        }
    }

    static async setExternalUserId(userId: string) {
        try {
            if (!this.initialized) {
                console.warn("OneSignal not initialized, waiting...");
                await this.init();
            }

            // Ensure user exists before login
            if (OneSignal.User.current()) {
                await OneSignal.login(userId);
                console.log("Successfully set external user ID");
            } else {
                console.warn("OneSignal user not available yet");
            }
        } catch (error) {
            console.error("Error setting external user ID:", error);
        }
    }

    static async getPermissionState() {
        return await OneSignal.Notifications.permission;
    }
}

export default NotificationService;
