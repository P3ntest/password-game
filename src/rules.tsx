import { ReactNode } from "react";
import { elements } from "./elements";
import { toppings } from "./pizza";
import { potus } from "./potus";
import { getCurrentClockEmoji } from "./time";

export type Rule = {
  index: number;
  test: (password: string) => boolean;
  content: string | ReactNode;
  dev?: boolean;
};

export const rules: Rule[] = [
  {
    test: (password: string) => password.length >= 6,
    content: "Password must be at least 6 characters long",
    dev: false,
  },
  {
    test: (password: string) => /[A-Z]/.test(password),
    content: "Password must contain an uppercase letter",
  },
  {
    content: "Password must contain a number",
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    content: "Password must contain a special character",
    test: (password: string) =>
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  },
  {
    content:
      "Your password must be made up of at least 4 words, seperated by spaces",
    test: (password: string) => password.split(" ").length >= 4,
  },
  {
    content: "There must be a total even amount of spaces",
    test: (password: string) => {
      console.log(
        password,
        password.split(" "),
        password.split(" ").length - 1
      );
      // console.log(password.split("").filter((c) => c == " ").length);

      return (password.split(" ").length - 1) % 2 === 0;
    },
  },
  {
    content: "Your password may not end or start with a space",
    test: (password: string) =>
      !password.startsWith(" ") && !password.endsWith(" "),
  },
  {
    content: "Your password may not end or start with a space",
    test: (password: string) =>
      !password.startsWith(" ") && !password.endsWith(" "),
  },
  {
    content: "Password must contain todays day of the week",
    test: (password: string) =>
      password
        .toLowerCase()
        .includes(
          new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase()
        ),
  },
  {
    content: "Password must be at least 10% numbers",
    test: (password: string) => {
      const numbers = password.split("").filter((c) => /[0-9]/.test(c));
      return numbers.length / password.length >= 0.1;
    },
  },
  {
    content: (
      <div>
        Password must contain the solution to this captcha
        <img
          src="https://captcha.com/images/captcha/180/botdetect-captcha-chipped.jpg"
          alt=""
        />
      </div>
    ),
    test: (password: string) => {
      return password.includes("8AYT");
    },
  },
  {
    content:
      "Password must contain a valid IBAN from the russian federation with spaces removed",
    test: (password: string) => {
      // find all "RU" indicies with regex
      const ruIndicies = [...password.matchAll(/RU/g)].map((m) => m.index);
      // check if the following 20 characters are numbers
      for (const index of ruIndicies) {
        const numbers = password.substring(index + 2, index + 22);
        if (numbers.match(/[0-9]{20}/)) {
          return true;
        }
      }
    },
  },
  {
    content:
      "The roman numerals in your password must add up to 30 (XXX) (case insensitive)",
    test: (password: string) => {
      password = password.toUpperCase() + " ";
      const romanNumeral = /[IVXLCDM]+[^IVXLCDM]/g;

      let romanNumerals: string[] =
        [...password.matchAll(romanNumeral)].map((a) => a[0]) || [];

      romanNumerals = romanNumerals.map((r) => r.slice(0, -1));

      console.log(romanNumerals);

      const sum = romanNumerals.reduce((a, b) => {
        return a + romanToInt(b);
      }, 0);

      console.log(sum);

      return sum === 30;
    },
  },
  {
    content:
      "All the first letters of the words must spell your favorite pizza topping",
    test: (password: string) => {
      // get all words and filter for only words containing letters and then map to the first character being a letter
      const words = password
        .split(" ")
        .filter((w) => /[a-zA-Z]/.test(w))
        .map((w) => {
          // find the first letter
          const firstLetter = w.split("").find((c) => /[a-zA-Z]/.test(c));
          return firstLetter;
        });
      const word = words.join("");
      if (toppings.includes(word.toLowerCase())) {
        return true;
      } else return false;
    },
  },
  {
    content: "Must contain a POTUS last name",
    test: (password: string) => {
      for (const putus of potus) {
        if (password.toLowerCase().includes(putus)) {
          return true;
        }
      }
    },
  },
  {
    content:
      "It should contain a word spelled backwards, the space is not required",
    test: (password: string) =>
      password.toLowerCase().replaceAll(" ", "").includes("drowa"),
  },

  {
    content: (
      <div>
        Must contain the city of this street view
        <iframe
          src="https://www.google.com/maps/embed?pb=!4v1690557273659!6m8!1m7!1sCAoSLEFGMVFpcFBnbGt4OVE4OVB5NkcyaV9CeW0xbkg1Y0E0Uk9oM1ZzRElNUkxv!2m2!1d51.97134399780375!2d4.040393799606385!3f189.54546043761093!4f-24.980499022301316!5f0.7820865974627469"
          width="600"
          height="450"
          style={{
            border: 0,
          }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    ),
    test: (password: string) => password.toLowerCase().includes("rotterdam"),
  },
  {
    content: "Must contain the current time as an emoji (full hour)",
    test: (password: string) =>
      password.toLowerCase().includes(getCurrentClockEmoji()),
  },
  {
    content: "您的密码必须恰好包含 10 个大写字母",
    test: (password: string) => {
      const uppercase = password
        .split("")
        .filter((c) => c == c.toUpperCase() && /[A-Z]/.test(c));
      console.log(uppercase);
      return uppercase.length === 10;
    },
  },
  {
    content:
      "Your password must contain an element from the periodic table with correct capitalization and frog emojies representing the elements' number of protons in the nucleon.",
    test: (password: string) => {
      const frogs = (password.match(/🐸/g) || []).length;
      console.log("frogs", frogs);
      for (const element of elements) {
        if (password.includes(element.symbol)) {
          if (parseInt(element.number) == frogs) return true;
        }
      }
      return false;
    },
  },
  {
    content: "Your password must contain at least 10 frogs",
    test: (password: string) => {
      const frogs = (password.match(/🐸/g) || []).length;
      return frogs >= 10;
    },
  },
  {
    content: (
      <div className="select-none">
        The password must include the exact output of the following JavaScript
        code:
        <pre className="select-none">
          {"String.fromCharCode(66) + 'a' + + 'a' + \n((![]+[])[+!+[]])"}
        </pre>
      </div>
    ),
    test: (password: string) => {
      return password.includes("BaNaNa");
    },
  },
  {
    content:
      "The amount of frogs should represent the absolute delta of capital letters and lowercase letters",
    test: (password: string) => {
      const frogs = (password.match(/🐸/g) || []).length;
      const uppercase = password.match(/[A-Z]/g)?.length || 0;
      const lowercase = password.match(/[a-z]/g)?.length || 0;
      const delta = Math.abs(uppercase - lowercase);
      return frogs === delta;
    },
  },
  {
    content:
      "Each word may not be longer than 9 letters and must not exceed 13 total characters. Except it the word contains a frog, then it may may only contain 4 characters total",
    test: (password: string) => {
      const words = password.split(" ");
      for (const word of words) {
        if (word.includes("🐸")) {
          if (word.length > 4) return false;
        } else {
          if (word.length > 13) return false;
          const letters = word.match(/[a-zA-Z]/g)?.length || 0;
          if (letters > 9) return false;
        }
      }
      return password.length <= 13;
    },
  },
  {
    content:
      "The cross sum of the numbers in each word must be a prime number, except the word contains a symbol, then it must be a multiple of 3",
    test: (password: string) => {
      const words = password.split(" ");

      for (const word of words) {
        const numbers = word.match(/[0-9]/g)?.map((n) => parseInt(n)) || [];
        const sum = numbers.reduce((a, b) => a + b, 0);
        const hasSymbol = word.match(/[^a-zA-Z0-9]/g)?.length || 0;
        if (hasSymbol) {
          if (sum % 3 !== 0) return false;
        } else {
          if (!isPrime(sum)) return false;
        }
      }
      return true;
    },
  },
  {
    content:
      "The total sum of numbers must be lower than the lowest ascii value of all letters following a frog",
    test: (password: string) => {
      const numbers = password.match(/[0-9]/g)?.map((n) => parseInt(n)) || [];
      const sum = numbers.reduce((a, b) => a + b, 0);

      const frogIndices = password
        .split("")
        .map((c, i) => {
          if (c === "\uDC38") return i;
        })
        .filter((i) => i !== undefined);

      const ascii = password
        .split("")
        .map((c, i) => {
          if (i > frogIndices[0]) return c.charCodeAt(0);
        })
        .filter((i) => i !== undefined)
        .reduce((a, b) => Math.min(a, b), 0);

      return sum < ascii;
    },
  },
]
  .map((r, i) => ({ ...r, index: i + 1 }))
  .sort((a) => (a.dev ? -1 : 1))
  .splice(0, 2);

function isPrime(num: number) {
  if (num <= 1) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;

  const sqrt = Math.sqrt(num);
  for (let i = 3; i <= sqrt; i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

function romanToInt(roman: string) {
  const romanNumerals: { [key: string]: number } = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let result = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = romanNumerals[roman[i]];
    const next = romanNumerals[roman[i + 1]];
    if (current < next) {
      result -= current;
    } else {
      result += current;
    }
  }
  return result;
}
