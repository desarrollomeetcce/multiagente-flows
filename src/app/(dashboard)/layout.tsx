import { Box } from "@mui/material";


export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Box minHeight="100vh">
            {children}
        </Box>

    );
}
