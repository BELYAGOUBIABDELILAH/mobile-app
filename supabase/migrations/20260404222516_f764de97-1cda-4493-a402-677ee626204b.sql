
DELETE FROM providers_public WHERE id IN ('premium-dr-benali', 'premium-clinique-el-azhar', 'premium-pharma-ibn-sina');

UPDATE providers_public SET is_premium = true, is_verified = true WHERE id IN ('ref-doctor-10', 'ref-clinic-3', 'ref-pharmacy-7');
