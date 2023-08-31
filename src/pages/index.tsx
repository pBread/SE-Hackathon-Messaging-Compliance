import { useAppState, useSetState, type MessageRecord } from "@/state";
import { Button, FileInput, Table, Text, clsx, rem } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { result } from "lodash";
import Papa from "papaparse";
import { useEffect } from "react";

export default function Home() {
  const state = useAppState();

  useEffect(() => {
    state;
  }, [state]);

  return (
    <main>
      <header>
        <h1>SMS Risk Analysis</h1>
      </header>
      <div className="content flex flex-col items-center gap-4">
        <Controls />
        <Summary />

        <MessageTable />
      </div>
    </main>
  );
}

function Summary() {
  const state = useAppState();
  const setState = useSetState();

  const summary = state?.gpt?.summary as string;

  return <Text>{summary}</Text>;
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
    setState({ ...state, isFetching: true });
    const data = await fetch("/api/analyze-messages", {
      method: "POST",
      body: JSON.stringify(state.items),
    }).then((res) => res.json());

    const raw = result(data, "0.message.content") as string;

    const gpt = JSON.parse(raw);

    setState({ ...state, gpt, isFetching: false });
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

      <Button
        loading={state.isFetching}
        style={{ background: "#282c34" }}
        onClick={analyze}
      >
        Analyze
      </Button>
    </div>
  );
}

function MessageTable() {
  const state = useAppState();

  const messages = Object.values(state.items);

  const gpt = state.gpt;

  const rows = messages.map((msg) => {
    const analysis = result(gpt, msg.Sid, null);

    const className = !!analysis ? "bg-red-50" : "";

    return (
      <tr key={msg.Sid} className={className}>
        <td>{msg.From}</td>
        <td>{msg.To}</td>
        <td>{msg.Body}</td>
        <td>{msg.SentDate}</td>
        <td>{msg.Sid}</td>
        <td>{analysis}</td>
      </tr>
    );
  });

  return (
    <Table>
      <thead>
        <tr>
          <th>From</th>
          <th>To</th>
          <th>Body</th>
          <th>SentDate</th>
          <th>Sid</th>
          <th>Analysis</th>
        </tr>
      </thead>

      <tbody>{rows}</tbody>
    </Table>
  );
}
