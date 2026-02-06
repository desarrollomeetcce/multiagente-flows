"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  TextField,
  Chip,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

import ResponseTable from "./components/ResponseTable";
import {
  getResponses,
  toggleResponse,
} from "./application/responses.repository";

type ResponseType = "AUTO_RESPONSE" | "FOLLOW_UP";

export default function ResponsesPage() {
  const router = useRouter();
  const [rows, setRows] = useState<any[]>([]);
  const [tab, setTab] = useState<ResponseType>("AUTO_RESPONSE");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  function load() {
    startTransition(async () => {
      const data = await getResponses({
        type: tab,
        search,
      });
      setRows(data);
    });
  }

  useEffect(() => {
    load();
  }, [tab, search]);

  function onToggle(id: string) {
    startTransition(async () => {
      await toggleResponse(id);
      load();
    });
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        {/* HEADER */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Respuestas automáticas
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Administra autorespuestas y follow-ups del sistema
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="medium"
            onClick={() =>
              router.push(
                tab === "AUTO_RESPONSE"
                  ? "/flows/new"
                  : "/flows/new?type=follow-up"
              )
            }
          >
            Nueva
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* TABS */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 2,
            "& .MuiTabs-flexContainer": {
              gap: 1,
            },
          }}
        >
          <Tab
            value="AUTO_RESPONSE"
            label={<Chip label="Autorespuestas" />}
          />
          <Tab
            value="FOLLOW_UP"
            label={<Chip label="Follow-ups" />}
          />
        </Tabs>

        {/* TOOLBAR */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <TextField
            size="small"
            label="Buscar"
            placeholder="Buscar por nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
          />
        </Stack>

        {/* TABLE */}
        <ResponseTable
          rows={rows}
          loading={isPending}
          onEdit={(id) => router.push(`/flows/${id}`)}
          onToggle={onToggle}
        />
      </Paper>
    </Box>
  );
}
