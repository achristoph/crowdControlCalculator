/**
 * Created by daniel.cluff on 5/30/16.
 */
var crowdControlCalc = (function () {
  "use strict";

  var calculator = {};

  calculator.calculateCrowdControlChange = function (input) {
    var currentSeverity = 0;
    var effects = input.sort(function(a, b) {return a[0] - b[0]});
    var queuedEffects = {};
    var effectChanges = [];
    var lastEffect = effects[effects.length-1];
    var lastEffectEndTime = lastEffect[0] + lastEffect[1];

    for (var i = 0; i < effects.length; i++) {
      var effectStart = effects[i][0];
      var effectEnd = (effects[i][0] + effects[i][1]);
      var effectSeverity = effects[i][2];

      if (effectSeverity > currentSeverity) {
        effectChanges.push([effectStart, effectSeverity]);
        currentSeverity = effectSeverity;
      }
      queuedEffects[effectEnd] = effectSeverity;
      var j = effectStart;

      if (i == effects.length - 1) {
        effectChanges.push([effectEnd, 0]);
      }
      else {
        while (j <= effects[i + 1][0]) {
          var severityInQueue = queuedEffects[j];
          if (severityInQueue) {
            var nextInQ = j + 1;
            while (!queuedEffects[nextInQ] && nextInQ <= lastEffectEndTime) {
              nextInQ++;
            }
            currentSeverity = queuedEffects[nextInQ];
            if (currentSeverity) {
              effectChanges.push([j, queuedEffects[nextInQ]]);
            } else {
              effectChanges.push([j, 0]);
              currentSeverity = 0;
              break;
            }
          }
          j++;
        }
      }
    }
    return effectChanges;
  };

  return calculator;
}());

console.log(crowdControlCalc.calculateCrowdControlChange([[2, 4, 5], [8, 1, 1], [3, 4, 2], [4, 1, 6]]));
// console.log(crowdControlCalc.calculateCrowdControlChange([[1, 2, 3], [2, 3, 3], [1, 5, 3], [6, 2, 3], [6, 1, 3]]));
// console.log(crowdControlCalc.calculateCrowdControlChange([[1, 2, 5], [2, 3, 3], [4, 2, 4]]));
// console.log(crowdControlCalc.calculateCrowdControlChange([[1, 2, 4], [5, 3, 6]]));
// console.log(crowdControlCalc.calculateCrowdControlChange([[0, 2, 3], [2, 3, 4], [5, 2, 2]]));

