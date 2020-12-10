class ScoreStorage {
  private name: string;

  constructor(name: string, totalScore?: number) {
    this.name = name;
    if (totalScore != null) {
      this.saveScore(totalScore);
    }
  }

  saveScore = (score: number) => {
    window.localStorage.setItem(
      this.name,
      JSON.stringify({ best: score.toFixed(0) }),
    );
  };

  getScore = (): number => {
    const scoreItem = window.localStorage.getItem(this.name);
    if (scoreItem != null) {
      const { best } = JSON.parse(scoreItem);
      return parseInt(best, 10);
    }

    return 0;
  };
}

export default ScoreStorage;
