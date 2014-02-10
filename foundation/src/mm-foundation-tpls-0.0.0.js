/*
 * angular-mm-foundation
 * http://madmimi.github.io/angular-foundation/

 * Version: 0.1.0 - 2014-02-05
 * License: MIT
 */
angular.module("mm.foundation", [/*"mm.foundation.tpls",*/ "mm.foundation.accordion"]);
//angular.module("mm.foundation.tpls", ["template/accordion/accordion-group.html","template/accordion/accordion.html"]);
angular.module('mm.foundation.accordion', [])

    .constant('accordionConfig', {
        closeOthers: true
    })

    .controller('AccordionController', ['$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {

        // This array keeps track of the accordion groups
        this.groups = [];

        // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
        this.closeOthers = function(openGroup) {
            var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
            if ( closeOthers ) {
                angular.forEach(this.groups, function (group) {
                    if ( group !== openGroup ) {
                        group.isOpen = false;
                    }
                });
            }
        };

        // This is called from the accordion-group directive to add itself to the accordion
        this.addGroup = function(groupScope) {
            var that = this;
            this.groups.push(groupScope);

            groupScope.$on('$destroy', function (event) {
                that.removeGroup(groupScope);
            });
        };

        // This is called from the accordion-group directive when to remove itself
        this.removeGroup = function(group) {
            var index = this.groups.indexOf(group);
            if ( index !== -1 ) {
                this.groups.splice(this.groups.indexOf(group), 1);
            }
        };

    }])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
    .directive('accordion', function () {
        return {
            restrict:'EA',
            controller:'AccordionController',
            transclude: true,
            replace: false,
            templateUrl: 'template/accordion/accordion.html'
        };
    })

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
    .directive('accordionGroup', ['$parse', function($parse) {
        return {
            require:'^accordion',         // We need this directive to be inside an accordion
            restrict:'EA',
            transclude:true,              // It transcludes the contents of the directive into the template
            replace: true,                // The element containing the directive will be replaced with the template
            templateUrl:'template/accordion/accordion-group.html',
            scope:{ heading:'@' },        // Create an isolated scope and interpolate the heading attribute onto this scope
            controller: function() {
                this.setHeading = function(element) {
                    this.heading = element;
                };
            },
            link: function(scope, element, attrs, accordionCtrl) {
                var getIsOpen, setIsOpen;

                accordionCtrl.addGroup(scope);

                scope.isOpen = false;

                if ( attrs.isOpen ) {
                    getIsOpen = $parse(attrs.isOpen);
                    setIsOpen = getIsOpen.assign;

                    scope.$parent.$watch(getIsOpen, function(value) {
                        scope.isOpen = !!value;
                    });
                }

                scope.$watch('isOpen', function(value) {
                    if ( value ) {
                        accordionCtrl.closeOthers(scope);
                    }
                    if ( setIsOpen ) {
                        setIsOpen(scope.$parent, value);
                    }
                });
            }
        };
    }]);

/*
angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/accordion/accordion-group.html",
        "<dd>\n" +
            "  <a ng-click=\"isOpen = !isOpen\" accordion-transclude=\"heading\">{{heading}}</a>\n" +
            "  <div class=\"content\" ng-style=\"isOpen ? {display: 'block'} : {}\" ng-transclude></div>\n" +
            "</dd>\n" +
            "");
}]);

angular.module("template/accordion/accordion.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/accordion/accordion.html",
        "<dl class=\"accordion\" ng-transclude></div>\n" +
            "");
}]);*/
