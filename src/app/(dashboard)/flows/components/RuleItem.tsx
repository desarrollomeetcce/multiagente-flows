import { Box, Switch, Typography } from "@mui/material";

export default function RuleItem({
    label,
    description,
    checked,
    onChange,
    disabled,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
        >
            <Box>
                <Typography fontWeight={500}>
                    {label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </Box>

            <Switch
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                color="success"
            />
        </Box>
    );
}
