import React from 'react'

// eslint-disable-next-line react/display-name
const IndeterminateCheckbox = React.forwardRef<any, any>(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef: any = ref || defaultRef

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
        )
    }
)

export default IndeterminateCheckbox
