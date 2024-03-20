export const external = (url, newWindow=false) => {
    if(newWindow===true) {
        return () => window.open(url, '_blank', 'location=yes,scrollbars=yes,status=yes')
    } else {
        return () => window.location.href = url;
    }
}