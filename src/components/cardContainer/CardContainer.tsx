interface CardContainerProps {
    children?: React.ReactNode;
}

export const CardContainer = (props: CardContainerProps) => {
    return <div className="p-4 bg-[var(--stable-primary-color)] rounded-lg">{props.children}</div>;
};
