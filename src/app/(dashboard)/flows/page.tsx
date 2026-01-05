"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

import ResponseTable from "./components/ResponseTable";
import { mockResponses } from "./utils/store";

export default function ResponsesPage() {
  const router = useRouter();
  const [rows, setRows] = useState(mockResponses);

  const toggleStatus = (id: string) => {
    setRows(prev =>
      prev.map(r =>
        r.id === id ? { ...r, active: !r.active } : r
      )
    );
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          Autorespuestas
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/responses/new")}
        >
          Nueva autorespuesta
        </Button>
      </Box>

      <ResponseTable
        rows={rows}
        onEdit={id => router.push(`/responses/${id}`)}
        onToggle={toggleStatus}
      />
    </Box>
  );
}
