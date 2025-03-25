'use client';

import { useState, useRef, useCallback } from 'react';
import { Button, Group, Stack, Title, Tooltip, Box, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

interface StyleState {
  fg: number;
  bg: number;
  st: number;
}

const tooltipTexts: Record<string, string> = {
  // FG
  "30": "Dark Gray (33%)",
  "31": "Red",
  "32": "Yellowish Green",
  "33": "Gold",
  "34": "Light Blue",
  "35": "Pink",
  "36": "Teal",
  "37": "White",
  // BG
  "40": "Blueish Black",
  "41": "Rust Brown",
  "42": "Gray (40%)",
  "43": "Gray (45%)",
  "44": "Light Gray (55%)",
  "45": "Blurple",
  "46": "Light Gray (60%)",
  "47": "Cream White",
};

const initialContent = `Welcome to <span class="ansi-33">Rebane</span>'s <span class="ansi-45"><span class="ansi-37">Discord</span></span> <span class="ansi-31">C</span><span class="ansi-32">o</span><span class="ansi-33">l</span><span class="ansi-34">o</span><span class="ansi-35">r</span><span class="ansi-36">e</span><span class="ansi-37">d</span> Text Generator!`;

export function ColorTextGenerator() {
  const textareaRef = useRef<HTMLDivElement>(null);
  const [copyCount, setCopyCount] = useState(0);

  const handleStyleClick = useCallback((ansiCode: string) => {
    if (!textareaRef.current) return;

    const selection = window.getSelection();
    if (!selection) return;

    if (ansiCode === '0') {
      // Reset all formatting
      if (textareaRef.current) {
        textareaRef.current.innerText = textareaRef.current.innerText;
      }
      return;
    }

    const text = selection.toString();
    if (!text) return;

    const span = document.createElement('span');
    span.innerText = text;
    span.classList.add(`ansi-${ansiCode}`);

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);

    range.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const nodesToANSI = useCallback((nodes: NodeList, states: StyleState[]): string => {
    let text = '';
    nodes.forEach((node) => {
      if (node.nodeType === 3) {
        text += node.textContent;
        return;
      }
      if (node.nodeName === 'BR') {
        text += '\n';
        return;
      }
      const className = (node as HTMLElement).className;
      if (!className) return;

      const ansiCode = +(className.split('-')[1]);
      const newState = { ...states[states.length - 1] };

      if (ansiCode < 30) newState.st = ansiCode;
      if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
      if (ansiCode >= 40) newState.bg = ansiCode;

      states.push(newState);
      text += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`;
      text += nodesToANSI((node as HTMLElement).childNodes, states);
      states.pop();
      text += '\x1b[0m';
      if (states[states.length - 1].fg !== 2) {
        text += `\x1b[${states[states.length - 1].st};${states[states.length - 1].fg}m`;
      }
      if (states[states.length - 1].bg !== 2) {
        text += `\x1b[${states[states.length - 1].st};${states[states.length - 1].bg}m`;
      }
    });
    return text;
  }, []);

  const handleCopy = useCallback(async () => {
    if (!textareaRef.current) return;

    const toCopy = '```ansi\n' + 
      nodesToANSI(textareaRef.current.childNodes, [{ fg: 2, bg: 2, st: 2 }]) + 
      '\n```';

    try {
      await navigator.clipboard.writeText(toCopy);
      
      const funnyCopyMessages = [
        'Copied!', 'Double Copy!', 'Triple Copy!', 'Dominating!!',
        'Rampage!!', 'Mega Copy!!', 'Unstoppable!!', 'Wicked Sick!!',
        'Monster Copy!!!', 'GODLIKE!!!', 'BEYOND GODLIKE!!!!'
      ];

      notifications.show({
        title: 'Success',
        message: funnyCopyMessages[Math.min(copyCount, funnyCopyMessages.length - 1)],
        color: copyCount <= 8 ? 'green' : 'red'
      });

      setCopyCount(prev => Math.min(11, prev + 1));
      setTimeout(() => setCopyCount(0), 2000);
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to copy text. Please try again.',
        color: 'red'
      });
    }
  }, [copyCount, nodesToANSI]);

  const insertLineBreak = useCallback(() => {
    if (!textareaRef.current) return;
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const br = document.createElement('br');
    range.insertNode(br);
    range.setStartAfter(br);
    range.setEndAfter(br);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!textareaRef.current) return;
    
    const text = e.clipboardData.getData('text/plain');
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      insertLineBreak();
    }
  }, [insertLineBreak]);

  return (
    <Stack gap="md" w="100%" align="center">
      <Title order={2}>Create your text</Title>
      
      <Group>
        <Button variant="light" onClick={() => handleStyleClick('0')}>
          Reset All
        </Button>
        <Button 
          variant="light" 
          className="ansi-1"
          onClick={() => handleStyleClick('1')}
        >
          Bold
        </Button>
        <Button 
          variant="light"
          className="ansi-4"
          onClick={() => handleStyleClick('4')}
        >
          Line
        </Button>
      </Group>

      <Group>
        <Text fw={700}>FG</Text>
        {[30, 31, 32, 33, 34, 35, 36, 37].map((code) => (
          <Tooltip key={code} label={tooltipTexts[code.toString()]}>
            <Button
              variant="light"
              className={`ansi-${code}-bg`}
              style={{ width: 32, padding: 0 }}
              onClick={() => handleStyleClick(code.toString())}
            />
          </Tooltip>
        ))}
      </Group>

      <Group>
        <Text fw={700}>BG</Text>
        {[40, 41, 42, 43, 44, 45, 46, 47].map((code) => (
          <Tooltip key={code} label={tooltipTexts[code.toString()]}>
            <Button
              variant="light"
              className={`ansi-${code}`}
              style={{ width: 32, padding: 0 }}
              onClick={() => handleStyleClick(code.toString())}
            />
          </Tooltip>
        ))}
      </Group>

      <Box
        ref={textareaRef}
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: initialContent }}
        style={{
          width: '600px',
          height: '200px',
          backgroundColor: '#2F3136',
          color: '#B9BBBE',
          border: '1px solid #202225',
          borderRadius: '5px',
          padding: '5px',
          whiteSpace: 'pre-wrap',
          fontSize: '0.875rem',
          lineHeight: '1.125rem',
          textAlign: 'left',
          fontFamily: 'monospace',
          overflowY: 'auto'
        }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />

      <Button onClick={handleCopy} size="lg">
        Copy text as Discord formatted
      </Button>
    </Stack>
  );
} 