export const useViewport = () => {
    return {
        isMobile: window.matchMedia("(max-width: 480px)").matches,
    };
};
