import * as React from 'react'
import { IconCheck, IconClipboard } from '@tabler/icons-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import { createStyles, MantineTheme } from '@mantine/core';

interface Props {
    language: string;
    message: string
}

const useStyles = createStyles((theme: MantineTheme) => ({
    container: {
        position: 'relative'
    },
    copyIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        "&:hover": {
            cursor: 'pointer'
        },
        color: theme.colors.gray[3]
    }
}))
const CodeBlock = ({ language, message }: Props) => {
    const { classes } = useStyles()

    const [isCopied, setIsCopied] = React.useState(false)

    const handleClickCopy = () => {
        const clipboard = navigator.clipboard
        if (!clipboard) {
            return
        }
        clipboard.writeText(message).then(() => {
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        })
    }

    return (
        <section className={classes.container}>
            <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
            >
                {message}
            </SyntaxHighlighter>
            {
                isCopied ? (
                    <span className={classes.copyIcon}>
                        <IconCheck size={18} />
                    </span>
                ) : (
                    <span className={classes.copyIcon} onClick={handleClickCopy}>
                        <IconClipboard size={18} />
                    </span>

                )

            }
        </section>
    )
}
export default React.memo(CodeBlock)
