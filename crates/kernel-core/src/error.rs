//! Common error values for platform-neutral kernel interfaces.

/// Errors that shared kernel interfaces may report.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum KernelError {
    InvalidInput,
    NotFound,
    PermissionDenied,
    Unsupported,
    ResourceExhausted,
    WouldBlock,
    Internal,
}
