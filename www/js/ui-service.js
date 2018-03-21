angular.module('services', [])
    .service("UI", ["$ionicHistory", "$ionicLoading", function ($ionicHistory, $ionicLoading) {

        this.showBusy = function (busy, msg) {
            if (busy) {
                if (!msg) {
                    msg = 'Loading...';
                }
                var template = msg;
                $ionicLoading.show({
                    template: template
                });
            } else {
                $ionicLoading.hide();
            }
        };

        this.showRunTime = function (start) {
            var end = new Date().getTime();
            console.debug("time taken " + (end - start) + " ms");
        }
    }]);