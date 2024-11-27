import { ColorSwatch } from "@mantine/core";
import clsx from "clsx";

export default function Debugger() {
  return (
    <div className={clsx(`debugger-page p-12`)}>
      <h1>Debugger page</h1>
      {/* Colors */}
      <h2>Colors</h2>
      <div className={clsx(`flex flex-row gap-4`)}>
        {[...new Array(9)].fill(1).map((_, idx) => (
          <ColorSwatch key={`color-test-${idx}`} color={`primary.${idx}`} />
        ))}
      </div>
    </div>
  );
}
