import { useEffect } from "react";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Rule, rules } from "./rules";

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

  const win = currentRule === rules.length;

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
      {win && (
        <div>You Win! Your score: {password.length} (Lower = Better)</div>
      )}
      <div ref={animateParent} className="flex flex-col items-stretch gap-4">
        {displayRules.map((rule) => (
          <RuleComponent rule={rule} key={rule.index} />
        ))}
      </div>
    </div>
  );
}

function RuleComponent({ rule }: { rule: Rule & { valid: boolean } }) {
  return (
    <div
      className={twMerge(
        "transition-all rounded-xl border-4 p-4 border-red-800 bg-red-200 max-w-xs lg:max-w-lg",
        rule.valid && "border-green-800 bg-green-200"
      )}
    >
      <h1 className="font-bold">Rule Nr. {rule.index}</h1>
      {rule.content}
    </div>
  );
}

function InputBox({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const defaultValue = useRef(value);
  const element = useRef<HTMLSpanElement>(null);

  const handleInput = (event) => {
    setValue(event.target.innerHTML);
  };

  useEffect(() => {
    if (element.current) {
      element.current.focus();
    }
    const handler = (event) => {
      event.preventDefault();
      const text = event.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    };
    element.current.addEventListener("paste", handler);
    return () => element.current.removeEventListener("paste", handler);
  }, []);

  return (
    <span
      ref={element}
      className="bg-amber-200 py-4 px-12 text-center rounded-full border-amber-800 border-4 text-amber-800 font-bold text-xl max-w-lg"
      contentEditable
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: defaultValue.current }}
    />
  );
}
