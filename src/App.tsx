import { ReactNode, useEffect } from "react";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toppings } from "./pizza";
import { potus } from "./potus";
import { TextInputStyle } from "discord.js";
import { getCurrentClockEmoji } from "./time";
import { elements } from "./elements";

function htmlDecode(input) {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent.replaceAll(" ", " ");
}

export default function App() {
  const [passwordValue, setPassword] = useState("");
  const [currentRule, setCurrentRule] = useState(0);
  const [animateParent] = useAutoAnimate();

  const password = htmlDecode(passwordValue);

  const [currentRules, setCurrentRules] = useState<
    (Rule & { valid: boolean })[]
  >([]);

  useEffect(() => {
    const currentRules = rules
      .slice(0, currentRule + 1)
      .map((rule) => ({ ...rule, valid: rule.test(password) }));

    if (
      currentRules.every((rule) => rule.valid) &&
      currentRule < rules.length
    ) {
      setCurrentRule(currentRule + 1);
    }

    setCurrentRules(currentRules);
  }, [password, currentRule]);

  const validRules = currentRules
    .filter((rule) => rule.valid)
    .sort((a, b) => b.index - a.index);
  const invalidRules = currentRules
    .filter((rule) => !rule.valid)
    .sort((a, b) => b.index - a.index);

  const displayRules = [...invalidRules, ...validRules];

  return (
    <div className="bg-amber-100 w-screen min-h-screen flex flex-col items-center gap-12 py-10">
      <h1 className="text-4xl font-bold text-center mt-8 text-amber-900 font-mono">
        Julius' Password Game
      </h1>
      <InputBox value={passwordValue} setValue={setPassword} />
      <div ref={animateParent} className="flex flex-col items-stretch gap-4">
        {displayRules.map((rule) => (
          <Rule rule={rule} key={rule.index} />
        ))}
      </div>
    </div>
  );
}

function Rule({ rule }: { rule: Rule & { valid: boolean } }) {
  return (
    <div
      className={twMerge(
        "transition-all rounded-xl border-4 p-4 border-red-800 bg-red-200",
        rule.valid && "border-green-800 bg-green-200"
      )}
    >
      <h1 className="font-bold">Rule Nr. {rule.index}</h1>
      {rule.content}
    </div>
  );
}

type Rule = {
  index: number;
  test: (password: string) => boolean;
  content: string | ReactNode;
};

const rules: Rule[] = [
  {
    test: (password: string) => password.length >= 6,
    content: "Password must be at least 6 characters long",
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
    content: "Your password must be made up of at least 4 words",
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
    content: "Must contain a PUTUS last name",
    test: (password: string) => {
      for (const putus of potus) {
        if (password.toLowerCase().includes(putus)) {
          return true;
        }
      }
    },
  },
  {
    content: "It should contain a word spelled backwards",
    test: (password: string) =>
      password.toLowerCase().replaceAll(" ", "").includes("drowa"),
  },
  {
    content: (
      <div>
        Must contain the country of this street view
        <iframe
          src="https://www.google.com/maps/embed?pb=!4v1690453073430!6m8!1m7!1sj2fSgIbHdAX8_eq4tFuPZg!2m2!1d50.43444190487158!2d30.55464948843401!3f3.903657316770904!4f-24.94467544822706!5f0.40338728051242523"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    ),
    test: (password: string) => password.toLowerCase().includes("ukraine"),
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
      "Your password must contain an element from the periodic table with correct capitalization",
    test: (password: string) => {
      for (const element of elements) {
        if (password.includes(element.symbol)) {
          console.log(element.symbol);
          return true;
        }
      }
      return false;
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
].map((r, i) => ({ ...r, index: i + 1 }));

function InputBox({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const defaultValue = useRef(value);

  const handleInput = (event) => {
    setValue(event.target.innerHTML);
  };

  return (
    <span
      className="bg-amber-200 py-4 px-12 text-center rounded-full border-amber-800 border-4 text-amber-800 font-bold text-xl max-w-lg"
      contentEditable
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: defaultValue.current }}
    />
  );
}
