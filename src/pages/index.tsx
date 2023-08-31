import { useAppState, useSetState, type MessageRecord } from "@/state";
import { Button, FileInput, Table, rem } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import Papa from "papaparse";

export default function Home() {
  const state = useAppState();
  const setState = useSetState();

  return (
    <main>
      <header>
        <h1>SMS Risk Analysis</h1>
      </header>
      <div className="content flex flex-col items-center gap-4">
        <Controls />
        <MessageTable />
      </div>
    </main>
  );
}

function Controls() {
  const state = useAppState();
  const setState = useSetState();

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // @ts-ignore
    Papa.parse(file, {
      complete: (result: { data: string[][] }) => {
        if (!result.data) return;

        const [keys, ...rows] = result.data;

        const items: Record<string, MessageRecord> = {};

        for (const row of rows) {
          const record: MessageRecord = row.reduce(
            (acc, cell, idx) => Object.assign(acc, { [keys[idx]]: cell }),
            {} as MessageRecord
          );
          items[record.Sid] = record;
        }

        setState({ ...state, items });
      },
    });
  };

  async function analyze() {
    await fetch("/api/analyze-messages", {
      method: "POST",
      body: JSON.stringify(state.items),
    });
  }

  return (
    <div className="w-50 flex gap-4">
      <FileInput
        placeholder="Upload Messages"
        icon={<IconUpload size={rem(14)} />}
        onChange={(csv) => {
          handleFileChange(csv);
        }}
      />

      <Button style={{ background: "#282c34" }} onClick={analyze}>
        {" "}
        Analyze{" "}
      </Button>
    </div>
  );
}

function MessageTable() {
  const state = useAppState();

  const messages = Object.values(state.items);

  const rows = messages.map((msg) => (
    <tr key={msg.Sid}>
      <td>{msg.From}</td>
      <td>{msg.To}</td>
      <td>{msg.Body}</td>
      <td>{msg.SentDate}</td>
      <td>{msg.Sid}</td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>From</th>
          <th>To</th>
          <th>Body</th>
          <th>SentDate</th>
          <th>Sid</th>
        </tr>
      </thead>

      <tbody>{rows}</tbody>
    </Table>
  );
}
