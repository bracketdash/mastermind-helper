function nextBestGuess(board) {
  const colors = ["a", "b", "c", "d", "e", "f"];
  let allPossibleCodes = generateAllPossibleCodes(colors, 4);
  for (const guess of board) {
    const code = guess.slice(0, 4);
    const blackPegs = guess[4];
    const whitePegs = guess[5];
    allPossibleCodes = allPossibleCodes.filter((possibleCode) => {
      const feedback = calculateFeedback(code, possibleCode);
      return feedback[0] === blackPegs && feedback[1] === whitePegs;
    });
  }
  if (allPossibleCodes.length === 1) {
    return allPossibleCodes[0];
  }
  let bestGuess = null;
  let bestScore = -Infinity;
  const guessCandidates =
    allPossibleCodes.length > 10
      ? getSampleGuesses(allPossibleCodes, colors)
      : allPossibleCodes;
  for (const candidate of guessCandidates) {
    let score = evaluateGuessCandidate(candidate, allPossibleCodes);
    if (score > bestScore) {
      bestScore = score;
      bestGuess = candidate;
    }
  }
  return bestGuess;
}

function generateAllPossibleCodes(colors, length) {
  if (length === 1) {
    return colors.map((color) => [color]);
  }
  const result = [];
  const subCodes = generateAllPossibleCodes(colors, length - 1);
  for (const color of colors) {
    for (const subCode of subCodes) {
      result.push([color, ...subCode]);
    }
  }
  return result;
}

function calculateFeedback(guess, code) {
  let blackPegs = 0;
  let whitePegs = 0;
  const guessColorCount = {};
  const codeColorCount = {};
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === code[i]) {
      blackPegs++;
    } else {
      guessColorCount[guess[i]] = (guessColorCount[guess[i]] || 0) + 1;
      codeColorCount[code[i]] = (codeColorCount[code[i]] || 0) + 1;
    }
  }
  for (const color in guessColorCount) {
    whitePegs += Math.min(
      guessColorCount[color] || 0,
      codeColorCount[color] || 0
    );
  }
  return [blackPegs, whitePegs];
}

function evaluateGuessCandidate(candidate, possibleCodes) {
  const feedbackPatterns = {};
  for (const code of possibleCodes) {
    const feedback = calculateFeedback(candidate, code);
    const feedbackKey = `${feedback[0]},${feedback[1]}`;
    feedbackPatterns[feedbackKey] = (feedbackPatterns[feedbackKey] || 0) + 1;
  }
  let worstCaseElimination = possibleCodes.length;
  for (const pattern in feedbackPatterns) {
    worstCaseElimination = Math.min(
      worstCaseElimination,
      feedbackPatterns[pattern]
    );
  }
  const isInPossibleCodes = possibleCodes.some((code) =>
    arraysEqual(code, candidate)
  );
  return (
    possibleCodes.length - worstCaseElimination + (isInPossibleCodes ? 0.1 : 0)
  );
}

function getSampleGuesses(possibleCodes, colors) {
  const result = [];
  const numSamples = Math.min(20, possibleCodes.length);
  const step = Math.floor(possibleCodes.length / numSamples);
  for (let i = 0; i < possibleCodes.length; i += step) {
    result.push(possibleCodes[i]);
  }
  for (let i = 0; i < colors.length && result.length < 30; i++) {
    for (let j = i + 1; j < colors.length && result.length < 30; j++) {
      result.push([colors[i], colors[i], colors[j], colors[j]]);
    }
  }
  return result;
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
