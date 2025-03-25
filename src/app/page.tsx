'use client';

import { Container, Title, Text, Stack, Paper } from '@mantine/core';
import { ColorTextGenerator } from './components/ColorTextGenerator';

export default function Home() {
  return (
    <Container size="lg" py="xl">
      <Stack align="center" gap="md">
        <Title order={1}>
          Rebane&apos;s Discord <Text span c="blue.6">Colored</Text> Text Generator
        </Title>

        <Paper p="md" w="100%">
          <Stack gap="xs">
            <Title order={3}>About</Title>
            <Text>
              This is a simple app that creates colored Discord messages using the ANSI color codes 
              available on the latest Discord desktop versions.
            </Text>
            <Text>
              To use this, write your text, select parts of it and assign colors to them, 
              then copy it using the button below, and send in a Discord message.
            </Text>
          </Stack>
        </Paper>

        <Paper p="md" w="100%">
          <Stack gap="xs">
            <Title order={3}>Source Code</Title>
            <Text>
              This app runs entirely in your browser and the source code is freely available on{' '}
              <Text component="a" href="https://gist.github.com/rebane2001/07f2d8e80df053c70a1576d27eabe97c" c="blue">
                GitHub
              </Text>. 
              Shout out to kkrypt0nn for{' '}
              <Text component="a" href="https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06" c="blue">
                this guide
              </Text>.
            </Text>
          </Stack>
        </Paper>

        <ColorTextGenerator />

        <Text size="sm" c="dimmed">
          This is an unofficial tool, it is not made or endorsed by Discord.
        </Text>
      </Stack>
    </Container>
  );
}
