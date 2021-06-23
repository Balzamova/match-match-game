import ScoreList from './components/score-page/score-list';
import Player from './components/score-page/player';

export default class DataBase {
  addUserToDataBase(gameResult: string[]): void {
    const request = indexedDB.open('Balzamova', 2);
    const [userName, userSurname, userEmail, userIcon, userScore] = gameResult;
    let db;

    request.onsuccess = function () {
      db = request.result;
      if (!db) { return; }

      const tx = db.transaction('players', 'readwrite');
      const players = tx.objectStore('players');

      const player = {
        name: userName,
        surname: userSurname,
        email: userEmail,
        icon: userIcon,
        score: userScore,
      };

      players.put(player);
    };

    this.readDB();
  }

  readDB(): void {
    const request = indexedDB.open('Balzamova');
    let db;

    request.onupgradeneeded = function () {
      db = request.result;
      const store = db.createObjectStore('players', { keyPath: 'email' });
      store.createIndex('by_email', 'email', { unique: true });
    };

    request.onsuccess = function (event) {
      db = (event.target as IDBOpenDBRequest).result;

      const objectStore = db.transaction('players').objectStore('players');
      const array: Array<Player> = [];

      objectStore.openCursor().onsuccess = function (evt: Event) {
        const cursor: IDBCursorWithValue = (<IDBRequest>evt.target).result;

        if (cursor) {
          const user: Player = new Player(
            cursor.value.name, cursor.value.surname, cursor.value.email, cursor.value.icon, cursor.value.score,
          );
          array.push(user);
          cursor.continue();
        } else {
          new DataBase().sortByScore(array);
        }
      };
    };
  }

  removeUserFromDB(elem: Player): void {
    const request = indexedDB.open('Balzamova');
    let db;

    request.onsuccess = function () {
      db = request.result;
      db.transaction(['players'], 'readwrite').objectStore('players').delete(elem.email);
    };
  }

  sortByScore(arr: Array<Player>): void {
    arr.sort((a: Player, b: Player) => {
      const c = +a.score;
      const d = +b.score;

      return d - c;
    });

    this.checkArrayLength(arr);
  }

  checkArrayLength(arr: Array<Player>): void {
    const maxLength = 10;

    if (arr.length > maxLength) {
      const last: Player = arr[arr.length - 1];
      this.removeUserFromDB(last);

      const array = arr.splice(0, maxLength);
      this.addToWinnerList(array);
    } else {
      this.addToWinnerList(arr);
    }
  }

  addToWinnerList(arr: Array<Player>): void {
    const list = new ScoreList();
    list.addWinner(arr);
  }
}
