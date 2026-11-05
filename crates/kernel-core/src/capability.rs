//! Small capability primitives for permission checks in shared kernel logic.

/// A permission that may be granted to a process or service.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u8)]
pub enum Capability {
    FileRead = 0,
    FileWrite = 1,
    ProcessInspect = 2,
    ProcessControl = 3,
    NetworkAccess = 4,
    DeviceAccess = 5,
}

impl Capability {
    const fn mask(self) -> u64 {
        1_u64 << (self as u8)
    }
}

const SUPPORTED_MASK: u64 = (1_u64 << 6) - 1;

/// A compact set of capabilities.
///
/// This is only a representation and helper API. Enforcement and secure
/// capability distribution must be implemented by the platform services.
#[derive(Clone, Copy, Debug, Default, Eq, PartialEq)]
pub struct CapabilitySet(u64);

impl CapabilitySet {
    /// An empty set of permissions.
    pub const EMPTY: Self = Self(0);

    /// Construct a set, discarding bits not defined by this version.
    pub const fn from_bits_truncate(bits: u64) -> Self {
        Self(bits & SUPPORTED_MASK)
    }

    /// Return the raw supported permission bits.
    pub const fn bits(self) -> u64 {
        self.0
    }

    /// Check whether a permission is present.
    pub const fn contains(self, capability: Capability) -> bool {
        (self.0 & capability.mask()) != 0
    }

    /// Grant a permission in this set.
    pub fn insert(&mut self, capability: Capability) {
        self.0 |= capability.mask();
    }

    /// Revoke a permission from this set.
    pub fn remove(&mut self, capability: Capability) {
        self.0 &= !capability.mask();
    }
}

#[cfg(test)]
mod tests {
    use super::{Capability, CapabilitySet};
    use std::assert_eq;

    #[test]
    fn permissions_can_be_granted_and_revoked() {
        let mut permissions = CapabilitySet::EMPTY;
        permissions.insert(Capability::FileRead);
        assert_eq!(permissions.contains(Capability::FileRead), true);
        assert_eq!(permissions.contains(Capability::FileWrite), false);

        permissions.remove(Capability::FileRead);
        assert_eq!(permissions.contains(Capability::FileRead), false);
    }

    #[test]
    fn unknown_permission_bits_are_discarded() {
        let permissions = CapabilitySet::from_bits_truncate(u64::MAX);
        assert_eq!(permissions.bits(), (1_u64 << 6) - 1);
    }
}
