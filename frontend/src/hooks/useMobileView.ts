export const useMobileView = () => {
    return {
        isMobile: window.matchMedia("(max-width: 480px)").matches,
    };
};
