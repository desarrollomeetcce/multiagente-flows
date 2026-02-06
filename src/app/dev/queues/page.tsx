"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { sendQueueMessageAction } from "./actions";



export default function QueueTesterPage() {
  const [queue, setQueue] = useState("RESPONSE_EVENT");
  const [payload, setPayload] = useState(`{
  "type": "INCOMING_MESSAGE",
  "session": "wp_1",
  "contactId": 123,
  "idChat": "521999999@c.us",
  "text": "hola",
  "tags": [1, 2]
}`);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    try {
      setLoading(true);
      await sendQueueMessageAction(queue, payload);
      alert("Mensaje enviado a la queue ✅");
    } catch (err: any) {
      alert(err.message || "Error enviando mensaje");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">
              🔧 Queue Tester
            </Typography>

            <TextField
              label="Queue"
              value={queue}
              onChange={(e) => setQueue(e.target.value)}
              fullWidth
            />

            <TextField
              label="Payload (JSON)"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              fullWidth
              multiline
              minRows={10}
              
            />

            <Button
              variant="contained"
              onClick={handleSend}
              disabled={loading}
            >
              Enviar a la Queue
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
