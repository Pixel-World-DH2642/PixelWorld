export function InstructionsCharacter() {
  return (
    <div className="bg-white p-4">
      <p>Use the arrow keys ➡️ ⬅️ ⬆️ to move around the world.</p>
    </div>
  );
}

export function InstructionsQuote() {
  return (
    <div className="border-2 border-black rounded-xl bg-white p-4 inline-block">
      <p>
        Are having a creative block? Generate a quote to inspire your next
        creation. Include it in a submission to have it attached in your
        painting submission.
      </p>
    </div>
  );
}

export function InstructionsCanvas() {
  return (
    <div className="border-2 border-black rounded-xl bg-white p-4 inline-block">
      <p>
        Here you can paint your drawing alongside your quote of the day. Missing
        a quote? Go back to the quote notice board to get one.
      </p>
    </div>
  );
}
