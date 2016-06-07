/**
 * Created by daniel.cluff on 5/30/16.
 */
var crowdControlCalc = (function () {
  "use strict";

  var calculator = {};

  calculator.calculateCrowdControlChange = function (input) {
    var effects = input.sort();
    var lastEffect = effects[effects.length - 1];
    var lastEffectEndTime = lastEffect[0] + lastEffect[1];
    var i = 0;
    var effectChanges = [];
    var queuedEffects = [];
    var currentSeverity = 0;

    while (i <= lastEffectEndTime) {
      if (queuedEffects.length > 0 && queuedEffects[0][0] == i) { //found endTime for this i in queue
        queuedEffects.shift();
        if (effects.length > 0 && effects[0][0] == i) { //found effect coming ,then compare it with queuedEffect
          if (queuedEffects.length == 0 && (effects[0][2] != currentSeverity)) {
            effectChanges.push([effects[0][0], effects[0][2]]);
            currentSeverity = effects[0][2];
          }
          else if (queuedEffects.length > 0 && effects[0][2] > queuedEffects[0][2]) {
            effectChanges.push([effects[0][0], effects[0][2]]);
            currentSeverity = effects[0][2];
          }
        } else {
          var severity = queuedEffects[0] ? queuedEffects[0][1] : 0;
          if (currentSeverity == severity) { //only record change for effect that has higher severity than the current one
            // p 'ignored'
          }
          else {
            effectChanges.push([i, severity]);
            currentSeverity = severity;
          }
        }
      }

      while (effects.length > 0 && effects[0][0] == i) { //found startTime for this i in queue
        var e = effects.shift();
        var effectStartTime = e[0];
        var effectEndTime = e[0] + e[1];
        var effectSeverity = e[2];

        if (effectSeverity > currentSeverity) {
          currentSeverity = effectSeverity;
          effectChanges.push([effectStartTime, effectSeverity])
        }

        queuedEffects.push([effectEndTime, effectSeverity]);
        queuedEffects = queuedEffects.sort();
      }
      i++;
    }
    return effectChanges;
  };
  return calculator;
}());

// console.log(crowdControlCalc.calculateCrowdControlChange([[2, 4, 5], [8, 1, 1], [3, 4, 2], [4, 1, 6]]));
// console.log(crowdControlCalc.calculateCrowdControlChange([[1, 2, 5], [2, 3, 3], [4, 2, 4]]));
// console.log(crowdControlCalc.calculateCrowdControlChange([[1, 2, 4], [5, 3, 6]]));
// console.log(crowdControlCalc.calculateCrowdControlChange([[0, 2, 3], [2, 3, 4], [5, 2, 2]]));
// console.log(crowdControlCalc.calculateCrowdControlChange([[1, 2, 3], [2, 3, 3], [1, 5, 3], [6, 2, 3], [6, 1, 3]]));

