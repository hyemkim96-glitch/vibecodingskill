'use client';

import ReactMarkdown from 'react-markdown';
import WikiHighlight from '@/components/WikiHighlight';

function processChildren(children: React.ReactNode): React.ReactNode {
    if (Array.isArray(children)) {
        return children.map((child, i) =>
            typeof child === 'string'
                ? <WikiHighlight key={i} text={child} />
                : child
        );
    }
    if (typeof children === 'string') {
        return <WikiHighlight text={children} />;
    }
    return children;
}

const mdComponents = {
    p: ({ children }: { children?: React.ReactNode }) => <p>{processChildren(children)}</p>,
    li: ({ children }: { children?: React.ReactNode }) => <li>{processChildren(children)}</li>,
};

export default function ArticleContent({ content }: { content: string }) {
    return (
        <ReactMarkdown components={mdComponents}>
            {content.replace(/\\n/g, '\n')}
        </ReactMarkdown>
    );
}
