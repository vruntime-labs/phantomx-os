//! Stable identifiers and version information shared across platform boundaries.

/// Version of the kernel-facing interface, independent of the OS release version.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct AbiVersion {
    pub major: u16,
    pub minor: u16,
    pub patch: u16,
}

impl AbiVersion {
    /// Construct an ABI version.
    pub const fn new(major: u16, minor: u16, patch: u16) -> Self {
        Self {
            major,
            minor,
            patch,
        }
    }
}

/// Initial interface version. It is not yet a promise of long-term ABI stability.
pub const KERNEL_ABI_VERSION: AbiVersion = AbiVersion::new(0, 1, 0);

/// Identifier for a process managed by a platform implementation.
pub type ProcessId = u64;

/// Identifier for a schedulable task or thread.
pub type TaskId = u64;

/// Identifier for a kernel or platform service.
pub type ServiceId = u32;
