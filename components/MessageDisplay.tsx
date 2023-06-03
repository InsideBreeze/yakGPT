import type { Message } from "@/stores/Message";
import * as React from 'react'
import { MemoizedReactMarkdown } from './MemoizedReactMarkdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import CodeBlock from "./CodeBlock";

import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you


import { createStyles, keyframes, MantineTheme } from "@mantine/core";

interface Props {
    message: Message;
    showRetry?: boolean;
    onRetry?: () => void;
    className?: string;
}

const blink = keyframes`
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
`;

const useStyles = createStyles((theme: MantineTheme) => ({
    container: {
        maxWidth: "calc(100vw - 55px)",
        [`@media (min-width: ${theme.breakpoints.md})`]: {
            maxWidth: "calc(820px - 120px)",
        },
        marginLeft: theme.spacing.md,
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        "& p": {
            margin: '0px',
            lineHeight: '1.55rem'
        },
    },
    table: {
        width: "100%",
        minWidth: "50%",
        marginBottom: theme.spacing.md,
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
        color:
            theme.colorScheme === "dark"
                ? theme.colors.gray[0]
                : theme.colors.dark[1],
        boxShadow: theme.shadows.sm,
        borderCollapse: "collapse",
        "& th, &td": {
            padding: theme.spacing.xs,
            border: `1px solid ${theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[3]
                }`,
            textAlign: "left",
            fontWeight: theme.colorScheme === "dark" ? 300 : 400,
            color:
                theme.colorScheme === "dark"
                    ? theme.colors.gray[0]
                    : theme.colors.dark[8],
        },
        "& th": {
            fontWeight: 500,
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[6],
        },
        "& tr:nth-of-type(even) td": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.colors.gray[8],
        },
        "& tr:nth-of-type(odd) td": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[7],
        },


    },
    message: {
        "& pre": {
            overflowX: "scroll",
        },
        "& table": {
        },
        "& th, & td": {
        },
    },
    loading: {
        [`p:last-child::after`]: {
            content: '"▎"',
            display: "inline-block",
            color:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[3]
                    : theme.colors.gray[5],
            animation: `${blink} 1s infinite`,
        },
    },
}));
const MessageDisplay = ({ message }: Props) => {
    const { classes, cx } = useStyles();
    const isBotReply = message.role === 'assistant'


    return (
        <div className={cx(classes.container, { [classes.loading]: message.loading })}>
            {
                isBotReply ? (
                    <MemoizedReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <CodeBlock language={match[1]} message={String(children).replace(/\n$/, '')} />
                                ) : (
                                    <code {...props} className={className}>
                                        {children}
                                    </code>
                                )
                            },
                            table({ children }) {
                                return (
                                    <table className={classes.table}>
                                        {children}
                                    </table>
                                )
                            }
                        }}
                    >
                        {message.content}
                    </MemoizedReactMarkdown>
                ) : (
                    <div>
                        {message.content}
                    </div>
                )
            }

        </div >
    );
};

export default MessageDisplay
