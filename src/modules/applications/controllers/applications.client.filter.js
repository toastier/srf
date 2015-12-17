//TODO would prefer to use this rather than ng-if statements throughout review.reviewer

angular.module('applications').filter('hasReviewer', hasReviewer);

function hasReviewer() {
    return function (review) {
        return review.reviewer
    }
};
